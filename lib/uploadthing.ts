import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";

import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/* HELPER */
const authenticateUser = async (req: Request) => {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`,
    {
      headers: {
        cookie:
          req.headers.get("cookie") || "",
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!data.user) {
    throw new UploadThingError(
      "Unauthorized"
    );
  }

  return {
    userId: data.user.id,
  };
};

export const ourFileRouter = {

  /* AUDIO */
  audioUploader: f({
    audio: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })

    .middleware(async ({ req }) => {
      return await authenticateUser(req);
    })

    .onUploadComplete(async ({
      metadata,
      file,
    }) => {

      console.log(
        "Audio uploaded:",
        file.url
      );

      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

  backgroundUploader: f({

  "image/png": {
    maxFileSize: "32MB",
    maxFileCount: 1,
  },

  "image/jpeg": {
    maxFileSize: "32MB",
    maxFileCount: 1,
  },

  "image/webp": {
    maxFileSize: "32MB",
    maxFileCount: 1,
  },

  "image/gif": {
    maxFileSize: "32MB",
    maxFileCount: 1,
  },

  "video/mp4": {
    maxFileSize: "128MB",
    maxFileCount: 1,
  },

  "video/webm": {
    maxFileSize: "128MB",
    maxFileCount: 1,
  },

})
.middleware(async ({ req }) => {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`,
    {
      headers: {
        cookie:
          req.headers.get("cookie") || "",
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!data.user) {
    throw new UploadThingError(
      "Unauthorized"
    );
  }

  return {
    userId: data.user.id,
  };
})

.onUploadComplete(async ({
  metadata,
  file,
}) => {

  console.log(
    "Background uploaded:",
    file.url
  );

  return {
    uploadedBy: metadata.userId,
    url: file.url,
  };
}),

  vaultUploader: f({
    "image": { maxFileSize: "32MB", maxFileCount: 1 },
    "video": { maxFileSize: "128MB", maxFileCount: 1 },
    "audio": { maxFileSize: "32MB", maxFileCount: 1 },
    "pdf": { maxFileSize: "32MB", maxFileCount: 1 },
    "text": { maxFileSize: "8MB", maxFileCount: 1 },
    "blob": { maxFileSize: "64MB", maxFileCount: 1 },
  })
  .middleware(async ({ req }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
      headers: { cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });
    const data = await res.json();
    if (!data.user || data.user.role !== "owner") {
      throw new UploadThingError("Unauthorized: Owners only");
    }
    return { userId: data.user.id };
  })
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Vault file uploaded:", file.url);
    return { uploadedBy: metadata.userId, url: file.url, name: file.name, size: file.size };
  }),

} satisfies FileRouter;

export type OurFileRouter =
  typeof ourFileRouter;