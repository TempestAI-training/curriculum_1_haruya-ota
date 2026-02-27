export const GreetTS = () => {
const greet = (name:string) => {
    return "Hello,"+ name + "!!";

};

return (
    <div>
        <p>{greet("John")}</p>
        <p>{greet(42)}</p>
    </div>
)
}