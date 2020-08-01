export const AzureBlobService = () => {
  const uploadMedia = async (sourceMediaUri) => {
    const storageName = 'demodotnet48stg';
    const containerName = 'abc';
    const storageUrl = `https://${storageName}.blob.core.windows.net/${containerName}`;
    const sasKey =
      '?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2021-07-13T00:48:22Z&st=2020-07-12T16:48:22Z&spr=https&sig=lrJZgNnw6ITPwVEIsLRNPSwB5%2BAa4veXA943o9TRipo%3D';

    //  "https://demodotnet48stg.blob.core.windows.net/abc/surya.mp4?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2021-07-13T00:48:22Z&st=2020-07-12T16:48:22Z&spr=https&sig=lrJZgNnw6ITPwVEIsLRNPSwB5%2BAa4veXA943o9TRipo%3D";
    // "https://demodotnet48stg.blob.core.windows.net/abc/?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2021-07-12T16:50:57Z&st=2020-07-12T08:50:57Z&spr=https&sig=scbm30f60nFgojITU3ezQEQYDISEdOhPyusRifFk97I%3D";
    //  "&comp=block&blockid=1";

    // const sourceMediaUri = 'http://techslides.com/demos/sample-videos/small.mp4';
    // sourceMediaUri = 'https://www.4cb.online/assets/home-placeholder.mp4';
    // const sourceMediaUri = 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540ryrahul13%252FBharatTikTalk/Camera/4bfe9222-e403-47d4-b591-8101589f2002.mp4';

    const response = await fetch(sourceMediaUri);
    const blob = await response.blob();
    console.log(JSON.stringify(blob));
    let mediaName =  'advityadav.mp4';
    let signedUrl = storageUrl + '/' + mediaName + sasKey;
    console.log(blob.name);
    await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        processData: true,
        // 'Content-Type': blob.type,
        'Content-Type': 'application/octet-stream',
        'Content-Length': blob.size,
      },
      body: blob,
    })
      .then((rs) => {
        return storageUrl + '/' + mediaName;
      })
      .catch((e) => console.error(e));
  };

  return { uploadMedia };
};
