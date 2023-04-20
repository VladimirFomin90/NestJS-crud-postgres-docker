import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';


@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}

    @Get()
    getBookmark() {}

    @Get()
    getBookmarkById() {}

    @Post()
    createBookmark() {

    }

    @Patch()
    editBookmarkById() {}

    @Delete()
    deleteBookmarkById() {}



}
