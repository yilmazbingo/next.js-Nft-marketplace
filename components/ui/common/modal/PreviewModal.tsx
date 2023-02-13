import { Nft } from "@_types/nft";

type PreviewModalProps = {
  nft: Nft;
};

export default function PreviewModal({ nft }: PreviewModalProps) {
  // setting state is not right approach: https://stackoverflow.com/questions/75204443/first-download-image-button-click-is-downloading-html-file-in-react-js-next-j/75423702#75423702
  // const [downloadURL, setDownloadURL] = useState("");

  const createAnchorOnFly = (filename: string, content: string) => {
    var element = document.createElement("a");
    element.setAttribute("href", content);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const download = async () => {
    const result = await fetch(nft!.meta.image, {
      method: "GET",
      headers: {},
    });
    // const b = await result.json();  ailed to execute 'blob' on 'Response': body stream already read
    const blob = await result.blob();
    console.log("blob", blob);
    const url = URL.createObjectURL(blob);
    createAnchorOnFly(nft!.meta.name, url);
    URL.revokeObjectURL(url);

    // setDownloadURL(url);
  };
  const handleDownload = async (e: any) => {
    try {
      await download();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <aside className="hidden w-96 bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block">
      {nft && (
        <div className="pb-16 space-y-6">
          <div>
            <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
              <img src={nft.meta.image} alt="" className="object-cover" />
            </div>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  <span className="sr-only">Details for </span>
                  {nft.meta.name}
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  {nft.meta.description}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Information</h3>
            <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
              {nft.meta.attributes.map((attr) => (
                <div
                  key={attr.trait_type}
                  className="py-3 flex justify-between text-sm font-medium"
                >
                  <dt className="text-gray-500">{attr.trait_type}: </dt>
                  <dd className="text-gray-900 text-right">{attr.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex">
            <button
              onClick={handleDownload}
              type="button"
              className="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {/* <a href={downloadURL} download={nft.meta.name}> */}
              Download Image
              {/* </a> */}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
