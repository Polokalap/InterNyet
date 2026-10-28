type Props = {
    description: string;
}

export default function Bubble({ description }: Props) {

    return (

        <>

            <div className={"flex flex-col items-center justify-center select-none"} title={description}>

                <img src="/assets/icons/information.png" alt="Icon" width={"16px"} />
                
            </div>

        </>

    )

}