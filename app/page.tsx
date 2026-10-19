import Image from "next/image";
import Notice, { FileNotice } from "@/app/components/notice/Notice";

export default function Home() {

  return (

      <>

        <div className={"w-250 mt-0 m-auto pt-5 pb-5"}>

          <FileNotice title={"What is InterNyet?"} file={"./notices/welcome.md"} />

        </div>

      </>

  );

}
