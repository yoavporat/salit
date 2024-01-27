import { Client, isFullPage } from "@notionhq/client";
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
          status:
            user.properties["סטטוס"].type === "status" &&
            user.properties["סטטוס"].status?.name,
          type:
            user.properties["שיוך"].type === "multi_select" &&
            user.properties["שיוך"].multi_select.length > 0 &&
            user.properties["שיוך"].multi_select[0].name,
          phone:
            user.properties["טלפון"].type === "phone_number" &&
            user.properties["טלפון"].phone_number,
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
                property: "כוננות",
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
                property: "אירוע",
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

  async getAllFutureShifts() {
    const response = await this.client.databases.query({
      database_id: ShiftsDB,
      filter: {
        property: "זמן",
        date: {
          on_or_after: new Date(
            new Date().getTime() - 24 * 60 * 60 * 1000
          ).toISOString(),
        },
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

  async setUserStatus(userId: string, status: string) {
    const resposnse = await this.client.pages.update({
      page_id: userId,
      properties: {
        סטטוס: {
          type: "status",
          status: {
            name: status,
          },
        },
      },
    });
    return (
      resposnse.object === "page" &&
      isFullPage(resposnse) &&
      resposnse.properties["סטטוס"].type === "status" &&
      resposnse.properties["סטטוס"].status?.name
    );
  }
}
