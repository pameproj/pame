import { useEffect, useRef, useState } from "react";
import mockup from "@/../public/img/mockup.png";
import CategorySlider from "@c/CategorySlider.jsx";
import { motion } from "framer-motion";
import { getURL, uploadFile } from "@/firebase/config";
import { generateId } from "lucia";

export default function ClotheSlider({ wardrobeId, categories, clothes }) {
  // Slider ref hook
  const sliderRef = useRef(null);
  // Form ref hook
  const formRef = useRef(null);
  // New clothe id
  const [newClotheId, setNewClotheId] = useState("");
  // New Clothe Modal Visibility state hook
  const [newClotheModalVisibility, setNewClotheModalVisibility] =
    useState(false);
  // New Clothe Category Selected state hook
  const [newClotheCategorySelected, setNewClotheCategorySelected] =
    useState("");
  // File selected on fileInput URL for image source state hook
  const [fileURL, setFileURL] = useState("");
  // File to upload
  const [file, setFile] = useState(null);
  // Uploaded file URL
  const [imageURL, setImageURL] = useState("");
  // Display mode for slider
  const [carouselMode, setCarouselMode] = useState(true);

  // Function that handles the selection of a category for the new clothe
  const handleNewClotheCategorySelect = (categoryId) => {
    setNewClotheCategorySelected(categoryId);
  };

  // Function that handles the click on the form image
  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  // Function that handles the change of the fileInput
  const handleFileInputChange = (event) => {
    const newFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target.result;
      setFileURL(dataURL);
    };
    reader.readAsDataURL(newFile);

    setFile(newFile);
  };

  // Function that handles the form submit
  // It creates the ID for the new clothe making the
  // useEffect hook act in consecuence
  const handleFormSubmit = async () => {
    const id = generateId(15);
    setNewClotheId(id);
  };

  // useEffect hook that uploads to Firebase, gets image URL and set action to the form
  useEffect(() => {
    const uploadData = async () => {
      if (newClotheId !== "") {
        await uploadFile(file, "clothes/" + wardrobeId, newClotheId);
        const url = await getURL("clothes/" + wardrobeId, newClotheId);
        setImageURL(url);
        formRef.current.action = "api/newClothe";
      }
    };

    const waitForNewClotheId = () => {
      return new Promise((resolve) => {
        const checkNewClotheId = () => {
          if (newClotheId !== "") {
            resolve();
          } else {
            setTimeout(checkNewClotheId, 100); // Check again in 100 milliseconds
          }
        };
        checkNewClotheId();
      });
    };

    waitForNewClotheId().then(() => uploadData());
  }, [newClotheId]);

  return (
    <>
      <nav className="w-full py-2 grid items-center grid-cols-10 gap-2">
        {/** CONFIGURATION */}
        <aside className="flex justify-center items-center gap-8 col-span-full">
          {/** MOSSAICO VIEW */}
          <button className="rounded-md" onClick={() => setCarouselMode(false)}>
            <i className="text-2xl ri-dashboard-horizontal-fill"></i>
          </button>
          {/** CAROUSEL VIEW */}
          <button
            className="rounded-md"
            onClick={() => {
              setCarouselMode(true);
            }}
          >
            <i className="text-2xl ri-carousel-view"></i>
          </button>
          {/** ADD CLOTHE */}
          <button
            className="rounded-md"
            onClick={() =>
              setNewClotheModalVisibility(!newClotheModalVisibility)
            }
          >
            <i className="text-2xl ri-add-line"></i>
          </button>
        </aside>

        {/** SLIDER */}
        {/** CLOTHE LIST */}
        {carouselMode ? (
          <div
            id="clotheSlider"
            className="overflow-hidden col-span-full w-fit max-w-full px-0 relative"
            ref={sliderRef}
          >
            <motion.ul
              drag="x"
              dragConstraints={sliderRef}
              className="flex items-start justify-center gap-2 w-fit  flex-nowrap"
            >
              {clothes && clothes.length > 0 ? (
                clothes.map((c) => (
                  <div
                    key={c.id}
                    className={`w-36 md:w-44 rounded-xl overflow-hidden cursor-pointer bg-slate-50/50`}
                  >
                    <img
                      src={c.imageUrl}
                      className="h-64 md:h-72 w-full pointer-events-none object-cover mx-auto"
                    />
                  </div>
                ))
              ) : (
                <p className="text-nowrap text-center">
                  There are no clothes yet
                </p>
              )}
            </motion.ul>
          </div>
        ) : (
          <ul className="flex items-center justify-center flex-wrap gap-2 col-span-full">
            {clothes && clothes.length > 0 ? (
              clothes.map((c) => (
                <div
                  key={c.id}
                  className={`w-36 md:w-44 rounded-xl overflow-hidden cursor-pointer bg-slate-50/50`}
                >
                  <img
                    src={c.imageUrl}
                    className="h-64 md:h-72 w-full pointer-events-none object-cover mx-auto"
                  />
                </div>
              ))
            ) : (
              <p className="text-nowrap w-full text-center">
                There are no clothes yet
              </p>
            )}
          </ul>
        )}
      </nav>

      {/** NEW CLOTHE MODAL */}
      <dialog
        className={`${
          newClotheModalVisibility ? "flex" : "hidden"
        } w-screen h-screen top-0 left-0 items-center z-50 backdrop-blur-md bg-slate-800/50`}
      >
        <div className="m-auto w-[90%] md:max-w-[500px] bg-gradient-to-r from-slate-900 to-indigo-900 back p-4 rounded-xl">
          {/** HEADER */}
          <header className="flex items-center justify-between gap-4 pb-4">
            <h1 className="text-2xl">New Clothe</h1>
            <button
              onClick={() =>
                setNewClotheModalVisibility(!newClotheModalVisibility)
              }
            >
              <i className="text-2xl ri-close-line"></i>
            </button>
          </header>

          {/** FORM */}
          <main>
            <form
              className="flex flex-col items-start justify-start gap-4"
              method="POST"
              ref={formRef}
              onSubmit={handleFormSubmit}
            >
              {/** CLOTHE ID */}
              <input type="hidden" name="id" value={newClotheId} />
              {/** WARDROBE */}
              <input type="hidden" name="wardrobeId" value={wardrobeId} />
              {/** CATEGORY */}
              <input
                type="hidden"
                name="categoryId"
                value={newClotheCategorySelected}
                required
              />
              <CategorySlider
                wardrobeId={wardrobeId}
                categories={categories}
                showConfig={false}
                showAll={false}
                onCategorySelect={handleNewClotheCategorySelect}
              />

              {/** NAME */}
              <input
                className="bg-transparent py-1 px-4 w-full border-2 rounded-xl"
                type="text"
                name="name"
                placeholder="Name"
                required
              />

              {/** DESCRIPTION */}
              <input
                className="bg-transparent py-1 px-4 w-full border-2 rounded-xl"
                type="text"
                name="description"
                placeholder="Description"
              />

              {/** IMAGE */}
              <input
                type="file"
                name="fileInput"
                className="hidden"
                id="fileInput"
                onChange={handleFileInputChange}
              />
              <input type="hidden" name="url" value={imageURL} />
              <img
                src={fileURL || mockup.src}
                className="mx-auto h-64 w-full cursor-pointer object-contain"
                onClick={handleImageClick}
              />

              {/** LINK */}
              <input
                className="bg-transparent py-1 px-4 w-full border-2 rounded-xl"
                type="url"
                name="link"
                placeholder="Link"
              />

              {/** SUBMIT */}
              <button
                className="px-4 py-2 rounded-xl border-2 mx-auto"
                type="submit"
              >
                Add clothe
              </button>
            </form>
          </main>
        </div>
      </dialog>
    </>
  );
}