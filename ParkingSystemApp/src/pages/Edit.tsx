export default function Edit(coin:string,type:string, price:number) {
    return(
        <form action="">
            <span>{coin}</span>
            <label htmlFor="">{type}</label>
            <input type="text" value={price} />
        </form>
    )
}