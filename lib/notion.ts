import { Client, isFullPage } from "@notionhq/client";
import { Positions, Status, TUser } from "./utils";
import {
  GetDatabaseResponse,
  GetPageResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

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

    return response.results.map((user: GetPageResponse | GetDatabaseResponse) =>
      parseUser(user)
    ) as TUser[];
  }

  async getUser(userId: string): Promise<TUser | null> {
    return parseUser(
      await this.client.pages.retrieve({
        page_id: userId,
      })
    );
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
                new Date().getTime() - 6 * 60 * 60 * 1000
              ).toISOString(),
            },
          },
          {
            or: [
              {
                property: Positions.PATROL,
                relation: {
                  contains: userId,
                },
              },
              {
                property: Positions.ONCALL,
                relation: {
                  contains: userId,
                },
              },
              {
                property: Positions.FLOWERS,
                relation: {
                  contains: userId,
                },
              },
              {
                property: Positions.EAST,
                relation: {
                  contains: userId,
                },
              },
              {
                property: Positions.GATE,
                relation: {
                  contains: userId,
                },
              },
              {
                property: Positions.DRONE,
                relation: {
                  contains: userId,
                },
              },
              {
                property: Positions.EVENT,
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
            new Date().getTime() - 6 * 60 * 60 * 1000
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

  async getUserStatus(userId: string): Promise<Status> {
    const resposnse = await this.client.pages.retrieve({
      page_id: userId,
    });
    if (
      resposnse.object === "page" &&
      isFullPage(resposnse) &&
      resposnse.properties["סטטוס"].type === "status"
    ) {
      return resposnse.properties["סטטוס"].status?.name as Status;
    } else {
      return Status.UNAVAILABLE;
    }
  }

  async setUserStatus(userId: string, status: string): Promise<Status> {
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
    if (
      resposnse.object === "page" &&
      isFullPage(resposnse) &&
      resposnse.properties["סטטוס"].type === "status"
    ) {
      return resposnse.properties["סטטוס"].status?.name as Status;
    } else {
      return Status.UNAVAILABLE;
    }
  }
}

function parseUser(page: GetPageResponse | GetDatabaseResponse): TUser | null {
  if (
    page.object === "page" &&
    isFullPage(page) &&
    "title" in page.properties.Name
  ) {
    return {
      username: page.properties.Name.title[0].plain_text,
      id: page.id,
      status:
        page.properties["סטטוס"].type === "status" &&
        page.properties["סטטוס"].status?.name,
      type:
        page.properties["שיוך"].type === "multi_select" &&
        page.properties["שיוך"].multi_select.length > 0 &&
        page.properties["שיוך"].multi_select[0].name,
      phone:
        page.properties["טלפון"].type === "phone_number" &&
        page.properties["טלפון"].phone_number,
      isDroneOperator:
        page.properties["רחפן"].type === "checkbox" &&
        page.properties["רחפן"].checkbox,
      drafted: 
        page.properties["מגוייס"].type === "checkbox" && 
        page.properties["מגוייס"].checkbox,
    } as TUser;
  } else {
    console.error("Failed to parse user", page.id);
    return null;
  }
}
