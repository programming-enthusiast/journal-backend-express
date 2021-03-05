interface JournalEntry {
  id: string;
  journalId: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export { JournalEntry };
