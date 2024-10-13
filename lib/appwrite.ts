import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

//online
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.logicfables.seasavers",
  project: "66b0afe1000ab420e1c9",
  databaseId: "66fd7910001ed3369034",
  userCollectionId: "670378ea001d91b26686",
  eventCollectionId: "6704fb7c001f9b71da21",
  requestCollectionId: "6704fd230004142fc914",
  competitionCollectionId: "67069767003524bf141a",
  blogCollectionId: "6707798200047291fef3",
  commentCollectionId: "670778220001b2aa4c47",
  entryCollectionId: "6708c757000e12c56655",
};

const {
  endpoint,
  platform,
  project,
  databaseId,
  userCollectionId,
  eventCollectionId,
  requestCollectionId,
  competitionCollectionId,
  blogCollectionId,
  commentCollectionId,
  entryCollectionId,
} = appwriteConfig;

//localhost
// export const appwriteConfig = {
//   endpoint: "http://192.168.8.127:8081/v1",
//   platform: "com.logicfables.seasavers",
//   project: "6703b11c0011e872f7eb",
//   databaseId: "6703b5360021482c4264",
//   userCollectionId: "",
// };

const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.project)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);

// Register user
export async function createUser(
  email: string,
  password: string,
  username: string
) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    console.log(newAccount.$id);

    const avatarUrl = avatars.getInitials(username);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        role: "user",
      }
    );

    await signIn(email, password);

    return newUser;
  } catch (error) {
    throw new Error(String(error));
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(String(error));
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(String(error));
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

//Is Admin
export async function isAdmin() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    return currentUser.role === "admin";
  } catch (error) {
    throw new Error(String(error));
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Add Event
export async function addEvent(form: {
  title: string;
  description: string;
  date: Date;
  location: string;
  time: string;
  organizer: string;
  type: string;
  imgUrl?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) throw Error;
    const newEvent = await databases.createDocument(
      databaseId,
      eventCollectionId,
      ID.unique(),
      {
        title: form.title,
        description: form.description,
        date: form.date,
        location: form.location,
        time: form.time,
        organizer: form.organizer,
        type: form.type,
        imgUrl: form.imgUrl,
        createdBy: user.$id,
      }
    );

    return newEvent;
  } catch (error) {
    throw new Error(String(error));
  }
}

//update Event
interface Event {
  $id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  time: string;
  organizer: string;
  type: string;
}

export async function updateEvent(event: Event) {
  try {
    const updatedEvent = await databases.updateDocument(
      databaseId,
      eventCollectionId,
      event.$id,
      {
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        time: event.time,
        organizer: event.organizer,
        type: event.type,
      }
    );

    return updatedEvent;
  } catch (error) {
    throw new Error(String(error));
  }
}

//add Request
interface Request {
  fullName: string;
  email: string;
  phone: string;
  description: string;
  organizer: string;
}

export async function addRequest(form: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw Error;
    const newRequest = await databases.createDocument(
      databaseId,
      requestCollectionId,
      ID.unique(),
      {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        description: form.description,
        organizer: form.organizer,
        user: user.$id || "",
      }
    );

    return newRequest;
  } catch (error) {
    throw new Error(String(error));
  }
}

//get all events
export async function getEvents() {
  try {
    const events = await databases.listDocuments(
      databaseId,
      eventCollectionId,
      []
    );
    return events.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

//get one event by id
export async function getEventById(id: string) {
  try {
    const event = await databases.listDocuments(databaseId, eventCollectionId, [
      Query.equal("$id", id),
    ]);

    return event.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Get All Requests
export async function getRequests() {
  try {
    const requests = await databases.listDocuments(
      databaseId,
      requestCollectionId,
      []
    );
    return requests.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Get One Request by id
export async function getRequestById(id: string) {
  try {
    const request = await databases.listDocuments(
      databaseId,
      requestCollectionId,
      [Query.equal("$id", id)]
    );
    return request.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

///////////////////////////
//add competition

interface Competition {
  $id: string;
  title: string;
  location: string;
  date: Date;
  time: string;
  description: string;
  imgUrl?: string;
  isActive: boolean;
}

//Add Competition
export async function addCompetition(form: {
  title: string;
  location: string;
  date: Date;
  time: string;
  description: string;
  imgUrl: string;
  isActive: boolean;
}) {
  try {
    const newCompetition = await databases.createDocument(
      databaseId,
      competitionCollectionId,
      ID.unique(),
      {
        title: form.title,
        location: form.location,
        date: form.date,
        time: form.time,
        description: form.description,
        imgUrl: form.imgUrl,
        isActive: form.isActive,
      }
    );

    return newCompetition;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Update Competition
export async function updateCompetition(competition: Competition) {
  try {
    const updatedCompetition = await databases.updateDocument(
      databaseId,
      competitionCollectionId,
      competition.$id,
      {
        title: competition.title,
        location: competition.location,
        date: competition.date,
        time: competition.time,
        description: competition.description,
        imgUrl: competition.imgUrl,
        isActive: competition.isActive,
      }
    );

    return updatedCompetition;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Get All Competitions
export async function getCompetitions() {
  try {
    const competitions = await databases.listDocuments(
      databaseId,
      competitionCollectionId,
      []
    );
    return competitions.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Get One Competition by id
export async function getCompetitionById(id: string) {
  try {
    const competition = await databases.listDocuments(
      databaseId,
      competitionCollectionId,
      [Query.equal("$id", id)]
    );
    return competition.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

////////////////////////////
interface Blog {
  $id: string;
  title: string;
  category: [string];
  content: string;
  imgUrl?: string;
}

//Add Blog
export async function addBlog(form: {
  title: string;
  category: [string];
  content: string;
  imgUrl: string;
}) {
  try {
    const newBlog = await databases.createDocument(
      databaseId,
      blogCollectionId,
      ID.unique(),
      {
        title: form.title,
        category: form.category,
        content: form.content,
        imgUrl: form.imgUrl,
      }
    );

    return newBlog;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Update Blog
export async function updateBlog(blog: Blog) {
  try {
    const updatedBlog = await databases.updateDocument(
      databaseId,
      blogCollectionId,
      blog.$id,
      {
        title: blog.title,
        category: blog.category,
        content: blog.content,
        imgUrl: blog.imgUrl,
      }
    );

    return updatedBlog;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Get All Blogs
export async function getBlogs() {
  try {
    const blogs = await databases.listDocuments(
      databaseId,
      blogCollectionId,
      []
    );
    return blogs.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Get One Blog by id
export async function getBlogById(id: string) {
  try {
    const blog = await databases.listDocuments(databaseId, blogCollectionId, [
      Query.equal("$id", id),
    ]);
    return blog.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

///////////////////////////////////////

//Add Comment
export async function addComment(
  $id: string,
  comment: string,
  form: { blogId: string; comment: string }
) {
  try {
    const user = await getCurrentUser();
    if (!user) throw Error;

    const newComment = await databases.createDocument(
      databaseId,
      commentCollectionId,
      ID.unique(),
      {
        blog: form.blogId,
        comment: form.comment,
        user: user.$id,
      }
    );

    return newComment;
  } catch (error) {
    throw new Error(String(error));
  }
}

// //Update Comment
// export async function updateComment(comment: Comment) {
//   try {
//     const updatedComment = await databases.updateDocument(
//       databaseId,
//       commentCollectionId,
//       comment.$id,
//       {
//         blogId: comment.blogId,
//         comment: comment.commment,
//       }
//     );

//     return updatedComment;
//   } catch (error) {
//     throw new Error(String(error));
//   }
// }

//Get All Comments of the blog
export async function getComments(blogId: string) {
  try {
    const comments = await databases.listDocuments(
      databaseId,
      commentCollectionId,
      [Query.equal("blog", blogId)]
    );
    return comments.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

//////////////////////////////
//Get All Entries
export async function getEntries() {
  try {
    const entries = await databases.listDocuments(
      databaseId,
      entryCollectionId,
      []
    );
    return entries.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Get One Entry by id
export async function getEntryById(id: string) {
  try {
    const entry = await databases.listDocuments(databaseId, entryCollectionId, [
      Query.equal("$id", id),
    ]);
    return entry.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Add Entry
export async function addEntry(form: {
  competition: {
    $id: string;
  };
  user: {
    $id: string
  }
  totItems: number;
  totPoints: number;
  note: string;
}) {
  try {

    const newEntry = await databases.createDocument(
      databaseId,
      entryCollectionId,
      ID.unique(),
      {
        user: form.user.$id,
        competition: form.competition.$id,
        totItems: form.totItems,
        totPoints: form.totPoints,
        note: form.note,
      }
    );

    return newEntry;
  } catch (error) {
    throw new Error(String(error));
  }
}

//Update Entry
interface Entry {
  $id: string;
  user: {
    $id: string;
  };
  competition: {
    $id: string;
  };
  totItems: number;
  totPoints: number;
  note: string;
  isValid: boolean;
}

export async function updateEntry(entry: Entry) {
  try {

    const updatedEntry = await databases.updateDocument(
      databaseId,
      entryCollectionId,
      entry.$id,
      {
        user: entry.user.$id,
        competition: entry.competition.$id,
        totItems: entry.totItems,
        totPoints: entry.totPoints,
        note: entry.note,
        isValid: entry.isValid,
      }
    );

    return updatedEntry;
  } catch (error) {
    throw new Error(String(error));
  }
}