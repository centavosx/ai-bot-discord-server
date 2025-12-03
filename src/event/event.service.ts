import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Client,
  GatewayIntentBits,
  Message,
  OmitPartialGroupDMChannel,
} from 'discord.js';
import { ConfigService } from '../config/config.service';
import { HttpService } from '../http/http.service';
import { tryCatch } from '../@shared/utils/try-catch';
import { debounceTime, groupBy, mergeMap, Subject } from 'rxjs';

@Injectable()
export class EventService implements OnModuleInit {
  private message$ = new Subject<OmitPartialGroupDMChannel<Message<boolean>>>();
  private readonly client: Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.httpService.initialize({
      baseURL: this.configService.get('webhook'),
      headers: {
        Accept: '*/*',
        'CF-Access-Client-Id': this.configService.get(
          'CLOUDFLARE_ACCESS_CLIENT_ID',
        ),
        'CF-Access-Client-Secret': this.configService.get(
          'CLOUDFLARE_ACCESS_CLIENT_SECRET',
        ),
        Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}`,
      },
    });
  }

  async onModuleInit() {
    this.initializeMessagePipeline();

    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client?.user?.tag}!`);
      console.log('Application Id: ', this.client.application?.id);
      this.listenToEventMessages();
    });

    this.client.on('error', (error) => {
      console.error('Discord Client Error:', error);
    });

    this.client.login(this.configService.get('DISCORD_BOT_TOKEN'));
  }

  private initializeMessagePipeline() {
    this.message$
      .pipe(
        groupBy((interaction) => interaction.author.id),
        mergeMap((group$) => group$.pipe(debounceTime(2500))),
      )
      .subscribe(async (interaction) => {
        console.log(`${interaction.author.id} attempted an api call`);

        const [result, error] = await tryCatch(() =>
          this.httpService.post('/', {
            messageId: interaction.id,
            serverId: interaction.guildId,
            channelId: interaction.channelId,
            chatInput: interaction.content,
            attachmentUrls: interaction.attachments?.map((value) => value.url),
          }),
        );

        if (error) {
          console.error(error);
        }

        if (!result) return;

        console.log('Request status: ', result.status);
      });
  }

  listenToEventMessages() {
    this.client.on('messageCreate', async (interaction) => {
      const hasMention = Array.from(interaction.mentions.users.keys()).includes(
        String(this.client.application?.id),
      );

      console.log(`User-${interaction.author.id} mentions`, hasMention);

      if (!hasMention) return;

      this.message$.next(interaction);
    });
  }
}
