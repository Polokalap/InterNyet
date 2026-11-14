type Props = {
    description: string;
}

export default function Bubble({ description }: Props) {

    return (

        <>

            <div
                className={"relative flex flex-col items-center justify-center select-none"}
                title={description}
            >

                <img
                    src={"/assets/icons/information.png"}
                    alt={"Icon"}
                    width={"16px"}
                    className={"md:cursor-default cursor-pointer"}
                    onClick={() => {

                        if (window.innerWidth < 768) {

                            alert(description);

                        }

                    }}
                />
                
            </div>

        </>

    )

}