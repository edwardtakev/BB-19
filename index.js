const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Collection,
  ChannelType,
  PermissionsBitField
} = require('discord.js');
const fs = require('fs');

// ---------------------------
// Configuration / Constants
// ---------------------------
// Explicitly choose gateway intents required by the bot. Being explicit is clearer
// and avoids accidentally requesting all intents.
const INTENTS = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates
];

// Where command files live (organized by category folders)
const COMMANDS_PATH = './src/commands';

// Server-specific configuration (read from environment variables)
// These IDs should be set via docker-compose.yml or .env for each deployment
const SERVER_CONFIG = {
  // Welcome handler: channel where to post welcome embeds
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID || '1063051112543944734',
  // Welcome handler: role name to add to new members
  memberRoleName: process.env.MEMBER_ROLE_NAME || 'Member',
  // Voice handler: target voice channel ID (when user joins, create temp room)
  voiceLobbyChannelId: process.env.VOICE_LOBBY_CHANNEL_ID || '1296478713377980459',
  // Voice handler: category where temporary voice channels are created
  tempVoiceCategoryId: process.env.TEMP_VOICE_CATEGORY_ID || '1296480846181695528'
};

// Log active server configuration (useful for multi-server debugging)
if (process.env.NODE_ENV === 'production') {
  console.log('[CONFIG] Server IDs loaded from environment');
} else {
  console.log('[CONFIG] Using server IDs:', SERVER_CONFIG);
}

// Create the client
const client = new Client({ intents: INTENTS });
client.commands = new Collection();
client.snipes = new Map(); // simple in-memory store for deleted messages

// ---------------------------
// Helpers: load and register commands
// ---------------------------
/**
 * Load command modules from `src/commands/<category>/*.js` and populate
 * `client.commands` and `client.commandArray` for registration.
 */
function loadCommands(commandsPath) {
  client.commandArray = [];
  const categories = fs.readdirSync(commandsPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const category of categories) {
    const files = fs.readdirSync(`${commandsPath}/${category}`).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const command = require(`${commandsPath}/${category}/${file}`);
      if (!command || !command.data) continue;
      client.commands.set(command.data.name, command);
      client.commandArray.push(command.data.toJSON());
    }
  }
}

/**
 * Register application (slash) commands using the REST API.
 * Uses `DISCORD_TOKEN` and `CLIENT_ID` environment variables.
 */
async function registerCommands(clientId) {
  const DISCORD_TOKEN = process.env.DISCORD_TOKEN || process.env.TOKEN;
  if (!DISCORD_TOKEN) {
    console.warn('DISCORD_TOKEN not set — skipping command registration.');
    return;
  }

  if (!clientId) {
    console.warn('No clientId provided to registerCommands; skipping.');
    return;
  }

  try {
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v9');
    const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(clientId), { body: client.commandArray });
    console.log('Loaded commands to application.');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
}

// ---------------------------
// Event handlers (kept simple and documented)
// ---------------------------
let readyHandled = false;
function readyHandler() {
  // Guard so the handler runs only once even if multiple ready-like events fire
  if (readyHandled) return;
  readyHandled = true;

  console.log('\nBot is ready.');
  try { client.user.setActivity('with depression'); } catch (e) { /* ignore */ }
}

// Interaction (slash command / select menu) dispatcher
client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand && interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error('Command execution failed:', err);
        if (!interaction.replied) await interaction.reply({ content: 'Command error', ephemeral: true });
      }
    } else if (interaction.isStringSelectMenu && interaction.isStringSelectMenu()) {
      // Simple select menu handling example
      await interaction.deferReply({ ephemeral: true });
      const selected = interaction.values[0];
      await interaction.editReply({ content: `Selected: ${selected}` });
    }
  } catch (err) {
    console.error('interactionCreate handler error:', err);
  }
});

// Welcome new guild members: give a role and post a welcome embed
client.on('guildMemberAdd', async (member) => {
  try {
    // Add member role if configured
    if (SERVER_CONFIG.memberRoleName) {
      const role = member.guild.roles.cache.find(r => r.name === SERVER_CONFIG.memberRoleName);
      if (role) await member.roles.add(role).catch(() => {});
    }

    // Post welcome embed if channel is configured
    if (!SERVER_CONFIG.welcomeChannelId) {
      console.warn('WELCOME_CHANNEL_ID not set; skipping welcome message.');
      return;
    }

    const channel = member.guild.channels.cache.get(SERVER_CONFIG.welcomeChannelId);
    if (!channel) {
      console.warn(`Welcome channel ${SERVER_CONFIG.welcomeChannelId} not found in guild.`);
      return;
    }

    const username = member.user.username;
    const icon = member.displayAvatarURL();
    const memberCount = member.guild.members.cache.filter(m => !m.user.bot).size;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(`Добре Дошъл, ${username}!`)
      .setDescription(`Ти си **${memberCount}**-тия потребител в сървъра`)
      .setThumbnail(icon)
      .setImage('https://c.tenor.com/Z25t-Dm102AAAAAC/welcome.gif')
      .setFooter({ text: 'BB-9 | Have Fun!' })
      .setTimestamp();

    await channel.send({ embeds: [embed] }).catch(() => {});
  } catch (err) {
    console.error('guildMemberAdd error:', err);
  }
});

// Keep the most recent deleted message per-channel for the 'snipe' command
client.on('messageDelete', (message) => {
  try {
    if (!message || !message.channel) return;
    const att = message.attachments?.first();
    client.snipes.set(message.channel.id, {
      content: message.content,
      author: message.author,
      image: att ? att.proxyURL : null
    });
  } catch (err) { console.error('messageDelete error:', err); }
});

// Create temporary voice channels when a user joins a specific 'lobby' voice channel
client.on('voiceStateUpdate', async (oldState, newState) => {
  try {
    if (newState.channelId !== SERVER_CONFIG.voiceLobbyChannelId) return;

    // Verify required configuration
    if (!SERVER_CONFIG.voiceLobbyChannelId || !SERVER_CONFIG.tempVoiceCategoryId) {
      console.warn('Voice channel IDs not configured; skipping temporary voice room creation.');
      return;
    }

    // Create a temporary room for the joining member
    const guild = newState.guild;
    const temp = await guild.channels.create({
      name: `📢 | ${newState.member.displayName}'s room`,
      type: ChannelType.GuildVoice,
      parent: SERVER_CONFIG.tempVoiceCategoryId,
      permissionOverwrites: [
        { id: guild.id, allow: [PermissionsBitField.Flags.Connect] },
        { id: newState.member.user.id, allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ManageChannels] }
      ]
    });

    await newState.setChannel(temp);

    // Delete the temporary channel once empty
    const interval = setInterval(async () => {
      if (temp.members.size === 0) {
        await temp.delete().catch(() => {});
        clearInterval(interval);
      }
    }, 5000);
  } catch (err) { console.error('voiceStateUpdate error:', err); }
});

// ---------------------------
// Startup: load/register commands and login
// ---------------------------
async function start() {
  // Load commands first (we only prepare the payload)
  loadCommands(COMMANDS_PATH);

  const DISCORD_TOKEN = process.env.DISCORD_TOKEN || process.env.TOKEN;
  if (!DISCORD_TOKEN) {
    console.error('DISCORD_TOKEN not set. Exiting.');
    process.exit(1);
  }

  // Attach ready handler before login so it fires when client becomes ready
  client.on('clientReady', readyHandler);

  // Login; when login resolves the client is ready
  await client.login(DISCORD_TOKEN);

  // Determine application (client) id for command registration. Prefer env var, else use client.user.id
  const clientId = process.env.CLIENT_ID || client?.user?.id || null;
  if (!clientId) console.warn('CLIENT_ID not available; skipping command registration.');

  // Register commands now that we have a valid client id
  await registerCommands(clientId);
}

start().catch(err => {
  console.error('Failed to start bot:', err);
  process.exit(1);
});