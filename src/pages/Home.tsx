export const Home = (props:any) => {
    
    let owner = "Loading";

    const getOwner = async() => {
        //owner = await props.dlancer?.owner();
        //console.log(owner)
    }

    getOwner();


    return <div>Home {owner}</div>
}