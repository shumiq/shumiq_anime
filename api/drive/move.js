import axios from 'axios';

const moveUrl =
    'https://shumiq.synology.me:5001/webapi/entry.cgi?api=SYNO.FileStation.CopyMove&version=3&method=start&path=__FROM__&dest_folder_path=__TO__&remove_src=true';

export default async (req, res) => {
    const sid = req.query.sid.toString();
    const from = encodeURIComponent(req.query.from.toString());
    const to = encodeURIComponent(req.query.to.toString());
    const moveRes = await axios.get(
        moveUrl.replace("__FROM__",from).replace("__TO__",to) + `&_sid=${sid}`
    );
    if(moveRes.data.success) res.status(200).send();
    res.status(400).send();
};
