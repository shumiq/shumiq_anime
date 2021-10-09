import axios from 'axios';

const signInUrl =
    'https://shumiq.synology.me:5001/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=shumiq&passwd=__PASSWORD__&session=FileStation&format=sid';

const moveUrl =
    'https://shumiq.synology.me:5001/webapi/entry.cgi?api=SYNO.FileStation.CopyMove&version=3&method=start&path=__FROM__&dest_folder_path=__TO__&remove_src=true';

const signOutUrl =
    'https://shumiq.synology.me:5001/webapi/auth.cgi?api=SYNO.API.Auth&version=1&method=logout&session=FileStation';

export default async (req, res) => {
    const password = req.query.password.toString();
    const from = encodeURIComponent(req.query.from.toString());
    const to = encodeURIComponent(req.query.to.toString());
    const signInRes = await axios.get(signInUrl.replace("__PASSWORD__",password));
    if(!signInRes.data.success) {
        res.status(401).send();
        return ;
    }
    const sid = signInRes.data.data.sid;
    const moveRes = await axios.get(
        moveUrl.replace("__FROM__",from).replace("__TO__",to) + `&_sid=${sid}`
    );
    await axios.get(signOutUrl);
    if(moveRes.data.success) res.status(200).send();
    res.status(400).send();
};
