'use client';
import React, { useState } from 'react';
import { trpc } from '../_trpc/client';
import { Button, Form, Input, Label, TextField } from 'react-aria-components';
import { serverClient } from '../_trpc/serverClient';
import Link from 'next/link';

interface Props {
  initialBookmarks: Awaited<
    ReturnType<(typeof serverClient)['bookmarks']['getBookmarks']>
  >;
}






export const BookmarksSection = ({ initialBookmarks }: Props) => {
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const getBookmarks = trpc.bookmarks.getBookmarks.useQuery(undefined, {
    initialData: initialBookmarks,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });


  const addBookmark = trpc.bookmarks.addBookmark.useMutation({
  onSettled: () => {
    getBookmarks.refetch();
  },
});

const deleteBookmark = trpc.bookmarks.deleteBookmark.useMutation({
  onSettled: () => {
    getBookmarks.refetch();
  },
});

const formRef = React.useRef<HTMLFormElement>(null);



const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  let formData = new FormData(e.currentTarget);
  let bookmarkData = {
    // Use the 'as string' type assertion for required fields
    title: formData.get('title') as string,
    url: formData.get('url') as string,
    // Use '||' to provide an empty string as a fallback for optional fields
    description: (formData.get('description') as string) || '',
    type: (formData.get('type') as string) || '',
  };

  // Now 'bookmarkData' is correctly typed, and you can use the addBookmark mutation
  await addBookmark.mutateAsync(bookmarkData);

  // Reset the form using the ref
  if (formRef.current) {
    formRef.current.reset();
  }
};



  return (
    <div className="p-4 border border-black">
      <h1 className="text-3xl">Bookmark Section</h1>

      <div className="text-3xl">
        {getBookmarks.data?.map((bookmark) => (
          <div className="flex gap-4 items-center" key={bookmark.id}>
            <h1>{bookmark.title}</h1>
            <p>{bookmark.description}</p>
            {bookmark.url && <Link href={bookmark.url}>{bookmark.url}</Link>}
            <p>{bookmark.type}</p>
            <Button
              className="border border-black rounded-lg py-2 px-4 text-sm"
              onPress={async () => {
                deleteBookmark.mutate(bookmark.id);
              }}>Delete</Button>
          </div>
        ))}
      </div>
      <Button onPress={() => setShowAddBookmark(!showAddBookmark)}>
        {showAddBookmark ? 'Cancel' : 'Add new Bookmark'}
      </Button>
      {showAddBookmark && (
        <Form ref={formRef} onSubmit={onSubmit}>
        <TextField name="title">
          <Label>Title</Label>
          <Input />
        </TextField>
        <TextField name="url">
          <Label>URL</Label>
          <Input />
        </TextField>
        <TextField name="description">
          <Label>Description</Label>
          <Input />
        </TextField>
        <TextField name="type">
          <Label>Type</Label>
          <Input />
        </TextField>
        <Button type="submit">Submit</Button>
      </Form>
      )}
    </div>
  );
};
