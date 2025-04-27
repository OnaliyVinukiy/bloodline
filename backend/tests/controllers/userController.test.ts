process.env.AZURE_STORAGE_CONNECTION_STRING = "mock_azure_connection_string";
process.env.COSMOS_DB_CONNECTION_STRING = "mock_cosmos_db_connection_string";
import express, { Express } from "express";
import request from "supertest";
import multer from "multer";
import {
  getUserInfo,
  uploadAvatar,
  upsertDonor,
  getDonors,
  getDonorsDaily,
  getDonorByEmail,
  getDonorsByNIC,
  getDonorsCount,
} from "../../src/controllers/userController";
import fetch from "node-fetch";
import { Response } from "node-fetch";

// Mock types
type MockCollection = {
  updateOne: jest.Mock;
  findOne: jest.Mock;
  find: jest.Mock;
  countDocuments: jest.Mock;
  aggregate: jest.Mock;
};

type MockDb = {
  collection: jest.Mock<MockCollection>;
};

type MockMongoClient = {
  connect: jest.Mock;
  db: jest.Mock<MockDb>;
  close: jest.Mock;
};

jest.mock("mongodb", () => {
  const mockCollection = {
    updateOne: jest
      .fn()
      .mockResolvedValue({ matchedCount: 1, modifiedCount: 1 }),
    findOne: jest.fn(),
    find: jest.fn().mockReturnThis(),
    countDocuments: jest.fn(),
    aggregate: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue([]),
  };

  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
  };

  const mockClient = {
    connect: jest.fn().mockResolvedValue(null),
    db: jest.fn().mockReturnValue(mockDb),
    close: jest.fn().mockResolvedValue(null),
  };

  const MongoClient = jest.fn().mockImplementation(() => mockClient);

  return { MongoClient };
});

jest.mock("@azure/storage-blob", () => {
  const mockBlockBlobClient = {
    uploadData: jest.fn().mockResolvedValue({}),
    url: "https://mockurl.com/avatar.jpg",
  };

  const mockContainerClient = {
    getBlockBlobClient: jest.fn().mockReturnValue(mockBlockBlobClient),
  };

  const mockBlobServiceClient = {
    getContainerClient: jest.fn().mockReturnValue(mockContainerClient),
  };

  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockBlobServiceClient),
    },
  };
});

jest.mock("node-fetch", () => {
  return jest.fn();
});

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("Donor Controller Tests", () => {
  let app: Express;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup Express app for each test
    app = express();
    app.use(express.json());

    // Setup routes
    app.post("/api/users/info", getUserInfo);
    app.post(
      "/api/donors/upload-avatar",
      multer().single("avatar"),
      uploadAvatar
    );
    app.post("/api/donors", upsertDonor);
    app.get("/api/donors", getDonors);
    app.get("/api/donors/daily", getDonorsDaily);
    app.get("/api/donors/email/:email", getDonorByEmail);
    app.get("/api/donors/nic/:nic", getDonorsByNIC);
    app.get("/api/donors/count", getDonorsCount);

    // Mock environment variables
    process.env.AZURE_STORAGE_CONNECTION_STRING = "mock_azure_connection";
    process.env.COSMOS_DB_CONNECTION_STRING = "mock_cosmos_connection";
  });

  // Get User Info
  describe("getUserInfo", () => {
    it("should return user info when a valid access token is provided", async () => {
      // Mock the fetch response
      const mockUserInfo = {
        sub: "user123",
        given_name: "John",
        family_name: "Doe",
        email: "john.doe@example.com",
        roles: ["donor"],
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserInfo),
      } as unknown as Response;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse
      );

      const response = await request(app)
        .post("/api/users/info")
        .send({ accessToken: "valid_token" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        sub: "user123",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        role: ["donor"],
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.asgardeo.io/t/onaliy/oauth2/userinfo",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer valid_token",
            Accept: "application/json",
          },
        }
      );
    });

    it("should return 400 when no access token is provided", async () => {
      const response = await request(app).post("/api/users/info").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Access token is missing");
    });

    it("should return 500 when the Asgardeo API returns an error", async () => {
      const mockResponse = {
        ok: false,
        text: jest.fn().mockResolvedValue("Invalid token"),
      } as unknown as Response;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse
      );

      const response = await request(app)
        .post("/api/users/info")
        .send({ accessToken: "invalid_token" });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching user info");
    });
  });

  // Upload Avatar
  describe("uploadAvatar", () => {
    it("should upload avatar and update user record", async () => {
      const response = await request(app)
        .post("/api/donors/upload-avatar")
        .field("email", "test@example.com")
        .attach("avatar", Buffer.from("mock file content"), "avatar.jpg");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "avatarUrl",
        "https://mockurl.com/avatar.jpg"
      );

      const mockMongo = require("mongodb") as jest.Mocked<
        typeof import("mongodb")
      >;
      const mockClientInstance = mockMongo.MongoClient.mock.results[0]
        .value as MockMongoClient;
      const mockCollection = mockClientInstance.db().collection();

      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { email: "test@example.com" },
        { $set: { avatar: "https://mockurl.com/avatar.jpg" } }
      );
    });

    it("should return 400 when no file is uploaded", async () => {
      const response = await request(app)
        .post("/api/donors/upload-avatar")
        .field("email", "test@example.com");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("No file uploaded");
    });
  });

  // Update Donor
  describe("upsertDonor", () => {
    it("should create or update donor record", async () => {
      const donorData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        bloodType: "A+",
        nic: "12345678V",
      };

      const response = await request(app).post("/api/donors").send(donorData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Donor profile upserted successfully!"
      );

      const mockMongo = require("mongodb") as jest.Mocked<
        typeof import("mongodb")
      >;
      const mockClientInstance = mockMongo.MongoClient.mock.results[0]
        .value as MockMongoClient;
      const mockCollection = mockClientInstance.db().collection();

      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { email: "john.doe@example.com" },
        { $set: donorData },
        { upsert: true }
      );
    });
  });

  // Fetch Donors
  describe("getDonors", () => {
    it("should return all donors", async () => {
      const mockDonors = [
        { email: "donor1@example.com", name: "Donor One" },
        { email: "donor2@example.com", name: "Donor Two" },
      ];

      const mockMongo = require("mongodb");
      const mockClientInstance = new mockMongo.MongoClient();
      const mockCollection = mockClientInstance.db().collection();

      mockCollection.find.mockReturnThis();
      mockCollection.toArray.mockResolvedValueOnce(mockDonors);

      const response = await request(app).get("/api/donors");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDonors);
    });
  });

  // Fetch Daily Registered Donors
  describe("getDonorsDaily", () => {
    it("should return donors registered daily", async () => {
      const mockDailyData = [
        { date: "2025-04-01", count: 3 },
        { date: "2025-04-02", count: 5 },
      ];

      const mockMongo = require("mongodb");
      const mockClientInstance = new mockMongo.MongoClient();
      const mockCollection = mockClientInstance.db().collection();

      mockCollection.aggregate.mockReturnThis();
      mockCollection.toArray.mockResolvedValueOnce(mockDailyData);

      const response = await request(app).get("/api/donors/daily");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDailyData);
    });
  });

  // Fetch Donors By Email
  describe("getDonorByEmail", () => {
    it("should return donor information when email exists", async () => {
      const mockDonor = {
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        bloodType: "O+",
      };

      const mockMongo = require("mongodb");
      const mockClientInstance = new mockMongo.MongoClient();
      const mockCollection = mockClientInstance.db().collection();

      mockCollection.findOne.mockResolvedValueOnce(mockDonor);

      const response = await request(app).get(
        "/api/donors/email/test@example.com"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDonor);
    });

    it("should return 404 when donor email does not exist", async () => {
      const mockMongo = require("mongodb");
      const mockClientInstance = new mockMongo.MongoClient();
      const mockCollection = mockClientInstance.db().collection();

      mockCollection.findOne.mockResolvedValueOnce(null);

      const response = await request(app).get(
        "/api/donors/email/nonexistent@example.com"
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Donor not found");
    });
  });

  // Fetch Donors by NIC
  describe("getDonorsByNIC", () => {
    it("should return donor information when NIC exists", async () => {
      const mockDonor = {
        email: "test@example.com",
        nic: "12345678V",
        firstName: "Test",
        lastName: "User",
      };

      const mockMongo = require("mongodb");
      const mockClientInstance = new mockMongo.MongoClient();
      const mockCollection = mockClientInstance.db().collection();

      mockCollection.findOne.mockResolvedValueOnce(mockDonor);

      const response = await request(app).get("/api/donors/nic/12345678V");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDonor);
    });

    it("should return 404 when NIC does not exist", async () => {
      const mockMongo = require("mongodb");
      const mockClientInstance = new mockMongo.MongoClient();
      const mockCollection = mockClientInstance.db().collection();

      mockCollection.findOne.mockResolvedValueOnce(null);

      const response = await request(app).get("/api/donors/nic/99999999V");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Donor not found");
    });
  });

  // Fetch Donor Count
  describe("getDonorsCount", () => {
    it("should return the total number of donors", async () => {
      const mockMongo = require("mongodb");
      const mockClientInstance = new mockMongo.MongoClient();
      const mockCollection = mockClientInstance.db().collection();

      mockCollection.countDocuments.mockResolvedValueOnce(25);

      const response = await request(app).get("/api/donors/count");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ count: 25 });
    });
  });
});
