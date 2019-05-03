function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')
    ;
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

const worker = async store => {
  console.log(store);
  const req = await navigator.serviceWorker.register("sw.js")
      console.log("ASD");
      try {
        var asd = await req.pushManager.getSubscription();
        console.log(JSON.stringify(asd), req.pushManager);
        if (asd) return asd;
        var subs = await req.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array("BN2zBJXQxH85mxkiJUlMmji0X8ko_qHvg2Wx6vYaKFvkF0sHaqD7vfOwtVTIwk0MlYHMwQJEE4pAP5XfrbxoZGU"),
          });
        console.log(JSON.stringify(subs));
        } catch (e) { console.log(e) }
};

export default worker;
