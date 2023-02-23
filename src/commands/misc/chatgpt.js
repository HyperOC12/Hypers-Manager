const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('ChatGPT API as a chat command.')
        .addStringOption(option => option
            .setName('question')
            .setDescription('The question you want to ask.')
            .setRequired(true)
            .setMinLength(1)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const question = options.getString('question');

        await interaction.deferReply();
        try {
            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });

            const openai = new OpenAIApi(configuration);

            const completion = await openai.createCompletion({
                model: 'text-davinci-002',
                prompt: question,
                max_tokens: 1000
            })

            await interaction.editReply(completion.data.choices[0].text);
        } catch (error) {
            await interaction.editReply('Oops! Something went wrong...')
        }
    },
};
