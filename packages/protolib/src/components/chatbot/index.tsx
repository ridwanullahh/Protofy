import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import DefaultIdeas from "./components/DefaultIdea/DefaultIdeas";
import UserQuery from "./components/UserInput/UserQuery";
import GptIntro from "./components/Ui/GptIntro";
import { Plus, Menu, PanelLeft } from "lucide-react";
import Header from "./components/Header/Header";
import useChat, { chatsLength, useAuth } from "./store/store";
import classNames from "classnames";
import Chats from "./components/Chat/Chats";
import Modal from "./components/modals/Modal";
import Apikey from "./components/modals/Apikey";
import { useThemeSetting } from "@tamagui/next-theme";
import { Stack } from "tamagui";

const applyTheme = (resolvedTheme) => {
  console.log("resolvedTheme", resolvedTheme);
  if (resolvedTheme === "light" && document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
  } else if(resolvedTheme === "dark" && !document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.add("dark");
  }
}

function App() {
  const [active, setActive] = useState(false);
  const isChatsVisible = useChat(chatsLength);
  const addNewChat = useChat((state) => state.addNewChat);
  let userHasApiKey = useAuth((state) => state.apikey);
  const { resolvedTheme } = useThemeSetting();
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);


  return (
    <Stack backgroundColor={resolvedTheme==="light"?"":"#212121"} f={1}>
      <div className="App font-montserrat md:flex dark:bg-[#212121]">
        <Navbar active={active} setActive={setActive} />
        <div className="">
          <button
            type="button"
            className="shadow fixed p-2 h-8 w-8 text-sm top-4 left-4 border-2 hidden md:inline-flex dark:text-white text-gray-700 dark:border border-gray-400 rounded-md items-center justify-center"
            onClick={() => setActive(true)}
          >
            <PanelLeft />
          </button>
        </div>
        <div
        style={{ position: "fixed", width: "100%"}}
          className="p-3 z-10 flex items-center justify-between bg-[#171717] dark:bg-[#212121] border-b sticky top-0 text-gray-300 md:hidden">
          <button onClick={() => setActive(true)} className=" text-2xl flex">
            <Menu />
          </button>
          <h2>New chat</h2>
          <button className="text-2xl flex items-center" onClick={addNewChat}>
            <Plus />
          </button>
        </div>
        <main
        style={{marginTop:"50px"}}
          className={classNames("w-full transition-all duration-500", {
            "md:ml-[200px]": active,
          })}
        >
          {isChatsVisible ?? <GptIntro />}
          {isChatsVisible && <Chats />}
          <div
            className={classNames(
              "fixed left-0 px-2 right-0 transition-all duration-500 bottom-0 dark:shadow-lg py-1 shadow-md backdrop-blur-sm bg-white dark:bg-dark-primary",
              {
                "dark:bg-dark-primary bg-white": isChatsVisible,
                "md:ml-[260px]": active,
              }
            )}
          >
            <div className="max-w-2xl md:max-w-[calc(100% - 260px)] mx-auto">
              {!isChatsVisible && (
                <>
                  <DefaultIdeas />
                </>
              )}

              <div className="dark:bg-inherit">
                <UserQuery />
                <footer className="py-3" />
              </div>
            </div>
          </div>
        </main>
        <Modal visible={!Boolean(userHasApiKey)}>
          <Apikey />
        </Modal>
      </div>
    </Stack>
  );
}

export default App;
