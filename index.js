require('dotenv').config();
 
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    REST,
    Routes,
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');
 
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});
 
const {
    BOT_TOKEN,
    CLIENT_ID,
    GUILD_ID,
    CATEGORY_ID,
    STAFF_ROLE_ID,
    CITIZEN_ROLE_ID
} = process.env;
 
const commands = [
    new SlashCommandBuilder()
        .setName('setupapproach')
        .setDescription('Kirim panel Req Approach')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    new SlashCommandBuilder()
        .setName('setupcitizen')
        .setDescription('Kirim panel Citizen Role')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
];
 
async function registerCommands() {
    const rest = new REST({ version: '10' })
        .setToken(BOT_TOKEN);
 
    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands.map(command => command.toJSON()) }
    );
 
    console.log('Slash command berhasil didaftarkan!');
}
 
client.once('ready', () => {
    console.log(`Bot aktif sebagai ${client.user.tag}`);
});
 
client.on('interactionCreate', async interaction => {
if (
    interaction.isButton() &&
    interaction.customId === 'get_citizen_role'
) {
    const role = interaction.guild.roles.cache.get(CITIZEN_ROLE_ID);

    if (!role) {
        return interaction.reply({
            content: 'Role Citizen tidak ditemukan.',
            ephemeral: true
        });
    }

    if (interaction.member.roles.cache.has(role.id)) {
        return interaction.reply({
            content: 'Kamu sudah memiliki role Citizen!',
            ephemeral: true
        });
    }

    await interaction.member.roles.add(role);

    return interaction.reply({
        content: '🟢 Berhasil! Kamu sekarang memiliki role Citizen.',
        ephemeral: true
    });
}
    try {
        if (interaction.isChatInputCommand()) {
if (interaction.commandName === 'setupcitizen') {

    const embed = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('🏴 WELCOME TO GREEN STREET HOOLIGANS')
        .setDescription(
            'Welcome to our community!\n\n' +
            'Before accessing the public channels, ' +
            'please claim your Citizen role below.\n\n' +
            '**📌 HOW TO GET ACCESS**\n' +
            '> Click the button below to receive your Citizen role.\n\n' +
            '**ROLE INFORMATION**\n' +
            '> 🏷️ Citizen — Public Community Member\n\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            'Respect the community. Enjoy your stay.'
        )
        .setFooter({
            text: 'Green Street Hooligans • Public Access'
        });

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('get_citizen_role')
            .setLabel('GET CITIZEN ROLE')
            .setEmoji('🟢')
            .setStyle(ButtonStyle.Success)
    );

    await interaction.reply({
        embeds: [embed],
        components: [row]
    });

    return;
}
            if (interaction.commandName !== 'setupapproach') return;
 
            const embed = new EmbedBuilder()
                .setColor(0x8B0000)
                .setTitle('🏴 GANGSTER APPROACH REQUEST')
                .setDescription(
                    'Welcome to our Gangster Approach Request System!\n\n' +
                    'Want to approach our faction in-game? Create a ticket below.\n\n' +
                    '**📌 APPROACH RULES**\n' +
                    '> • Follow all server roleplay rules.\n' +
                    '> • Respect every faction member.\n' +
                    '> • Do not spam multiple tickets.\n' +
                    '> • Wait patiently for a response.\n\n' +
                    '**🎫 HOW TO REQUEST**\n' +
                    'Click the button below to create your private ticket.'
                )
                .setFooter({
                    text: 'Gangster Faction • GTA SAMP Roleplay'
                })
                .setTimestamp();
 
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('create_approach_ticket')
                    .setLabel('Create Approach Ticket')
                    .setEmoji('🎫')
                    .setStyle(ButtonStyle.Danger)
            );
 
            await interaction.channel.send({
                embeds: [embed],
                components: [row]
            });
 
            await interaction.reply({
                content: 'Panel Req Approach berhasil dikirim!',
                ephemeral: true
            });
 
            return;
        }
 
        if (interaction.isModalSubmit() && interaction.customId === 'approach_form_submit') {
    const embed = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('📋 HASIL REQ APPROACH')
        .addFields(
            { name: '01. IC Name', value: interaction.fields.getTextInputValue('ic_name') },
            { name: '02. Lama Bermain RP', value: interaction.fields.getTextInputValue('rp_duration') },
            { name: '03. Umur OOC', value: interaction.fields.getTextInputValue('ooc_age') },
            { name: '04. Alasan Req Approach', value: interaction.fields.getTextInputValue('approach_reason') },
            { name: '05. Siap Interview?', value: interaction.fields.getTextInputValue('interview_ready') }
        )
        .setFooter({ text: 'Green Street Hooligans • Approach Department' })
        .setTimestamp();

    await interaction.reply({
        content: '✅ Formulir berhasil dikirim! Sekarang kirim screenshot stats in-game kamu di channel ini.',
        ephemeral: true
    });

    await interaction.channel.send({
        content: `📩 Formulir dari ${interaction.user}`,
        embeds: [embed]
    });

    return;
}
if (!interaction.isButton()) return;
if (interaction.isButton() && interaction.customId === 'open_approach_form') {
    const modal = new ModalBuilder()
        .setCustomId('approach_form_submit')
        .setTitle('Req Approach | GSH');

    const icName = new TextInputBuilder()
        .setCustomId('ic_name')
        .setLabel('Nama IC')
        .setPlaceholder('Masukkan nama karakter kamu')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const rpDuration = new TextInputBuilder()
        .setCustomId('rp_duration')
        .setLabel('Berapa lama bermain RP?')
        .setPlaceholder('Contoh: 2 tahun')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const oocAge = new TextInputBuilder()
        .setCustomId('ooc_age')
        .setLabel('Umur OOC')
        .setPlaceholder('Masukkan umur kamu')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const reason = new TextInputBuilder()
        .setCustomId('approach_reason')
        .setLabel('Alasan Req Approach')
        .setPlaceholder('Jelaskan alasan kamu')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const interview = new TextInputBuilder()
        .setCustomId('interview_ready')
        .setLabel('Siap mengikuti interview?')
        .setPlaceholder('Jawab: Siap / Tidak')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(icName),
        new ActionRowBuilder().addComponents(rpDuration),
        new ActionRowBuilder().addComponents(oocAge),
        new ActionRowBuilder().addComponents(reason),
        new ActionRowBuilder().addComponents(interview)
    );

    await interaction.showModal(modal);
    return;
}
if (interaction.customId === 'get_citizen_role') {
    const role = interaction.guild.roles.cache.get(CITIZEN_ROLE_ID);

    if (!role) {
        return interaction.reply({
            content: 'Role Citizen tidak ditemukan. Periksa CITIZEN_ROLE_ID.',
            ephemeral: true
        });
    }

    if (interaction.member.roles.cache.has(role.id)) {
        return interaction.reply({
            content: 'Kamu sudah memiliki role Citizen!',
            ephemeral: true
        });
    }

    await interaction.member.roles.add(role);

    return interaction.reply({
        content: 'Berhasil! Kamu sekarang memiliki role Citizen.',
        ephemeral: true
    });
}
 
        if (interaction.customId === 'create_approach_ticket') {
            const guild = interaction.guild;
            const user = interaction.user;
 
            const existing = guild.channels.cache.find(channel =>
                channel.type === ChannelType.GuildText &&
                channel.topic === `approach-owner:${user.id}`
            );
 
            if (existing) {
                await interaction.reply({
                    content: `Kamu sudah memiliki tiket: ${existing}`,
                    ephemeral: true
                });
                return;
            }
 
            const category = await guild.channels.fetch(CATEGORY_ID);

console.log("CATEGORY NAME:", category?.name);
console.log("CATEGORY TYPE:", category?.type);

if (!category || category.type !== ChannelType.GuildCategory) {
    throw new Error("CATEGORY_ID bukan ID kategori Discord!");
}
const channel = await guild.channels.create({
                name: `approach-${user.username}`
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '-')
                    .slice(0, 90),
                type: ChannelType.GuildText,
                parent: category.id || undefined,
                topic: `approach-owner:${user.id}`,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory
                        ]
                    },
                    {
                        id: STAFF_ROLE_ID,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory
                        ]
                    },
                    {
                        id: client.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.EmbedLinks,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.ManageChannels
                        ]
                    }
                ]
            });
 
            const ticketEmbed = new EmbedBuilder()
    .setColor(0x8B0000)
    .setTitle('🏴 REQ APPROACH | GREEN STREET HOOLIGANS')
    .setDescription(
        `Welcome ${user}!\n\n` +
        'Terima kasih sudah tertarik melakukan approach bersama Green Street Hooligans.\n\n' +
        '**📋 APPROACH REGISTRATION**\n' +
        '> Klik tombol di bawah untuk mengisi formulir Req Approach.\n\n' +
        '**📸 SCREENSHOT STATS**\n' +
        '> Setelah mengisi formulir, kirim screenshot stats karakter kamu di channel ini.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        '*Respect the Streets. Earn Your Place.*'
    )
    .setFooter({
        text: 'Green Street Hooligans • Approach Department'
    })
    .setTimestamp();

const formRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId('open_approach_form')
        .setLabel('Fill Req Approach')
        .setEmoji('📝')
        .setStyle(ButtonStyle.Danger)
);

const closeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId('close_approach_ticket')
        .setLabel('Close Ticket')
        .setEmoji('🔒')
        .setStyle(ButtonStyle.Secondary)
);
 
            await channel.send({
    content: `${user} <@&${STAFF_ROLE_ID}>`,
    embeds: [ticketEmbed],
    components: [formRow, closeRow],
                allowedMentions: {
                    users: [user.id],
                    roles: [STAFF_ROLE_ID]
                }
            });
 
            await interaction.reply({
                content: `Tiket kamu berhasil dibuat: ${channel}`,
                ephemeral: true
            });
 
            return;
        }
 
        if (interaction.customId === 'close_approach_ticket') {
            const channel = interaction.channel;
            const isStaff = interaction.member.roles.cache.has(STAFF_ROLE_ID);
            const isOwner = channel.topic ===
                `approach-owner:${interaction.user.id}`;
 
            if (!isStaff && !isOwner) {
                await interaction.reply({
                    content: 'Kamu tidak berhak menutup tiket ini.',
                    ephemeral: true
                });
                return;
            }
 
            await interaction.reply({
                content: 'Tiket akan ditutup dalam 3 detik.'
            });
 
            setTimeout(async () => {
                try {
                    await channel.delete('Approach ticket ditutup');
                } catch (error) {
                    console.error(error);
                }
            }, 3000);
        }
    } catch (error) {
        console.error(error);
 
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: 'Terjadi kesalahan. Periksa konfigurasi dan izin bot.',
                ephemeral: true
            }).catch(() => {});
        }
    }
});
 
async function startBot() {
    await registerCommands();
    await client.login(BOT_TOKEN);
}
 
startBot().catch(console.error);