export class CreatePostUseCaseDto {
  constructor(
    public postId: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
  ) {}
}
