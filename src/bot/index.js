const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { createPayoutEmbed, createCustomEmbed, createAnnouncementEmbed } = require('./embedBuilder');

class DiscordBot {
    constructor(token, channelId) {
        this.token = token;
        this.channelId = channelId;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages
            ]
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.once('ready', () => {
            console.log(`✓ Discord Bot logged in as ${this.client.user.tag}`);
            console.log(`✓ Bot is ready to send messages!`);
        });

        this.client.on('error', (error) => {
            console.error('Discord client error:', error);
        });
    }

    async connect() {
        try {
            await this.client.login(this.token);
            return true;
        } catch (error) {
            console.error('Failed to connect Discord bot:', error);
            throw error;
        }
    }

    async sendPayoutMessage(recipientName, amount, transactionId, transactionLink = '', notes = '') {
        try {
            const channel = await this.client.channels.fetch(this.channelId);
            if (!channel) {
                throw new Error('Channel not found');
            }

            // Add a small random delay (1-3 seconds) to prevent Discord from grouping messages
            // This makes each payout look like an individual automated event
            const delay = 1000 + Math.floor(Math.random() * 2000); // 1-3 seconds
            await new Promise(resolve => setTimeout(resolve, delay));

            const embed = createPayoutEmbed(recipientName, amount, transactionId, transactionLink, notes);
            const message = await channel.send({ embeds: [embed] });

            console.log(`✓ Payout message sent for ${recipientName}`);
            return message;
        } catch (error) {
            console.error('Error sending payout message:', error);
            throw error;
        }
    }

    async sendCustomMessage(content, useEmbed = false, embedTitle = '', embedColor = '#5865F2') {
        try {
            const channel = await this.client.channels.fetch(this.channelId);
            if (!channel) {
                throw new Error('Channel not found');
            }

            let message;
            if (useEmbed) {
                const embed = createCustomEmbed(embedTitle || 'Message', content, embedColor);
                message = await channel.send({ embeds: [embed] });
            } else {
                message = await channel.send(content);
            }

            console.log('✓ Custom message sent');
            return message;
        } catch (error) {
            console.error('Error sending custom message:', error);
            throw error;
        }
    }

    async sendAnnouncement(content) {
        try {
            const channel = await this.client.channels.fetch(this.channelId);
            if (!channel) {
                throw new Error('Channel not found');
            }

            const embed = createAnnouncementEmbed(content);
            const message = await channel.send({ embeds: [embed] });

            console.log('✓ Announcement sent');
            return message;
        } catch (error) {
            console.error('Error sending announcement:', error);
            throw error;
        }
    }

    isReady() {
        return this.client.isReady();
    }

    async disconnect() {
        await this.client.destroy();
    }
}

module.exports = DiscordBot;
