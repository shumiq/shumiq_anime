import axios from 'axios';

const listUrl =
  'https://shumiq.synology.me:5001/webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list&folder_path=/public_video/__PATH__';

export default async (req, res) => {
  const path = req.query.path.toString();
  const listRes = await axios.get(
    listUrl.replace('__PATH__', encodeURI(decodeURIComponent(path)))
  );
  res.send(listRes.data);
};
