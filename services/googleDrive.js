import * as FileSystem from "expo-file-system";

export async function uploadToDrive(token, data) {
  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=media",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return response.ok;
}

export async function downloadFromDrive(token) {
  const search = await fetch(
    "https://www.googleapis.com/drive/v3/files?q=name='transactions.json'",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const { files } = await search.json();

  if (!files || files.length === 0) return null;

  const { id } = files[0];

  const download = await fetch(
    `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return await download.json();
}
