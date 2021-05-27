import axios from 'axios';

const listUrl =
  'http://shumiq.synology.me:5000/webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list&folder_path=/public_video/__PATH__';

export default async (req, res) => {
  const path = req.query.path.toString();
  const listRes = await axios.get(
    listUrl.replace('__PATH__', decodeURIComponent(path))
  );
  res.send(listRes.data);
};
