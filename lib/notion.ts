import { Client, isFullPage } from "@notionhq/client";
import { TitlePropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { TUser } from "./utils";

const ShiftsDB = "2564fd1207ab415386bac64fbb17a46c";
const SadakDB = "b43d42afe4aa47d7ba2b863c4415e977";

export class Notion {
  client: Client;

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_TOKEN });
  }

  async getAllUsers(): Promise<TUser[]> {
    const response = await this.client.databases.query({
      database_id: SadakDB,
      sorts: [
        {
          property: "Name",
          direction: "ascending",
        },
      ],
    });

    return response.results.map((user) => {
      if (
        user.object === "page" &&
        isFullPage(user) &&
        "title" in user.properties.Name
      ) {
        return {
          username: user.properties.Name.title[0].plain_text,
          id: user.id,
        };
      }
    }) as TUser[];
  }

  async getUserShifts(userId: string) {
    const response = await this.client.databases.query({
      database_id: ShiftsDB,
      filter: {
        and: [
          {
            property: "זמן",
            date: {
              on_or_after: new Date(
                new Date().getTime() - 4 * 60 * 60 * 1000
              ).toISOString(),
            },
          },
          {
            or: [
              {
                property: "סיור",
                relation: {
                  contains: userId,
                },
              },
              {
                property: "מזרחי",
                relation: {
                  contains: userId,
                },
              },
              {
                property: "פרחים",
                relation: {
                  contains: userId,
                },
              },
              {
                property: "ש״ג",
                relation: {
                  contains: userId,
                },
              },
              {
                property: "רחפן",
                relation: {
                  contains: userId,
                },
              },
              {
                property: "בית ספר",
                relation: {
                  contains: userId,
                },
              },
            ],
          },
        ],
      },
      sorts: [
        {
          property: "זמן",
          direction: "ascending",
        },
      ],
    });
    return response.results;
  }
}
