import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # Kullanıcı bilgileri
  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    tasks: [Task!]   
    chats: [Chat!]   
  }

  # Roller
  enum Role {
    APPLICANT
    MODERATOR
    MANAGER
  }

  # Görevler
  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    dueDate: String!
    assignedTo: User!
    dependency: Task
    progress: Int!
    notes: [Note!]
  }

  # Görev durumları
  enum TaskStatus {
    ASSIGNED
    IN_PROGRESS
    REVIEW
    APPROVED
    REJECTED
  }

  # Notlar
  type Note {
    id: ID!
    content: String!
    createdBy: User!
    createdAt: String!
  }

  # Mesajlaşma sistemi
  type Chat {
    id: ID!
    members: [User!]!
    messages: [Message!]!
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    createdAt: String!
  }

  # Queries
  type Query {
    me: User
    users: [User!]
    tasks(userId: ID): [Task!]
    chats: [Chat!]
    task(id: ID!): Task
  }

  # Mutations
  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String!

    createTask(title: String!, description: String, dueDate: String!, assignedTo: ID!): Task!
    updateTask(id: ID!, status: TaskStatus, notes: String): Task!
    deleteTask(id: ID!): Boolean!

    sendMessage(chatId: ID!, content: String!): Message!
    createChat(memberIds: [ID!]!): Chat!
  }

  # Subscriptions (gerçek zamanlı)
  type Subscription {
    messageAdded(chatId: ID!): Message!
    taskUpdated(userId: ID!): Task!
  }
`;
