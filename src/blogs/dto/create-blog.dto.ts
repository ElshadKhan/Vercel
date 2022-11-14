export class CreateBlogDto {
constructor(public name: string,
            public youtubeUrl: string) {
}
}
export class CreateBlogDbType {
    constructor(public id: string,
                public name: string,
                public youtubeUrl: string,
                public createdAt: string
    ) {
    }
}
export class BlogsBusinessType {
    constructor(public pagesCount: number,
                public page: number,
                public pageSize: number,
                public totalCount: number,
                public items: Array<CreateBlogDbType>) {
    }

}