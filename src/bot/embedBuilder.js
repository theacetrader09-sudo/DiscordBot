const { EmbedBuilder } = require('discord.js');

// Your Fundings4u logo from Discord CDN
const BOT_AVATAR_URL = 'https://media.discordapp.net/attachments/1437468891352928410/1437837835892691117/Profile_Pic.png';

/**
 * Create a compact embed using fields (like Shark Payment Bot style)
 */
function createPayoutEmbed(recipientName, amount, transactionId, transactionLink = '', notes = '') {
    // Format current time
    const now = new Date();
    const formattedTime = now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    // Shorten transaction hash for display (like example: 063f048236028c9...)
    const shortHash = transactionId.length > 19
        ? transactionId.substring(0, 15) + '...'
        : transactionId;

    // Build transaction display (clickable if link provided)
    let transactionDisplay;
    if (transactionLink && transactionLink.trim()) {
        transactionDisplay = `[${shortHash}](${transactionLink})`;
    } else {
        transactionDisplay = `\`${shortHash}\``;
    }

    const embed = new EmbedBuilder()
        .setColor('#2F3136')
        .setAuthor({
            name: 'Fundings4u Payment Bot',
            iconURL: BOT_AVATAR_URL
        })
        .setTitle('💸 Payout Sent')
        .setDescription('A New Payout is Sent.')
        .addFields(
            { name: 'PayoutAmount', value: `**${amount}**`, inline: false },
            { name: 'Status', value: '✅ Confirmed', inline: false },
            { name: 'Time', value: formattedTime, inline: false },
            { name: 'Transaction Hash', value: transactionDisplay, inline: false }
        )
        .setThumbnail(BOT_AVATAR_URL)
        .setFooter({
            text: 'Fundings4u Payment Bot • Payment Network',
            iconURL: BOT_AVATAR_URL
        })
        .setTimestamp();

    // Add notes as additional field if provided
    if (notes && notes.trim()) {
        embed.addFields({ name: 'Notes', value: notes, inline: false });
    }

    return embed;
}

/**
 * Create a compact custom embed
 */
function createCustomEmbed(title, description, color = '#5865F2') {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({
            name: 'Fundings4u Bot',
            iconURL: BOT_AVATAR_URL
        })
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter({
            text: 'Fundings4u Bot',
            iconURL: BOT_AVATAR_URL
        });

    return embed;
}

/**
 * Create a compact announcement embed
 */
function createAnnouncementEmbed(message) {
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setAuthor({
            name: 'Fundings4u Official',
            iconURL: BOT_AVATAR_URL
        })
        .setTitle('📢 Important Announcement')
        .setDescription(message)
        .setTimestamp()
        .setFooter({
            text: 'Fundings4u Official Announcement',
            iconURL: BOT_AVATAR_URL
        });

    return embed;
}

module.exports = {
    createPayoutEmbed,
    createCustomEmbed,
    createAnnouncementEmbed
};
