export class UpdatePostUseCaseDto {
  constructor(
    public postId: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
  ) {}
}

export class CreatePostUseCaseDto {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public userId: string,
  ) {}
}
