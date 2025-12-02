import { Label } from "@/components/ui/label";
export default function MtgCard({data}){
    console.log(data)
    return(
        <div>
            <h1>{data.name}</h1>
        </div>
    )
}