import  * as bcrypt from "bcrypt";

export const getSkipNumber = (pageNumber: number,pageSize: number) => {
        return (pageNumber - 1) * pageSize
}

export const getPagesCounts= (totalCount: number, pageSize: number) => {return (Math.ceil(totalCount/pageSize))}

export const _generateHash = async(password: string, salt: string) => {
        const hash = await bcrypt.hash(password , salt)
        return hash
}