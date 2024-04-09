import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { UserInfo } from '@src/user/decorators/user-info.decorator'
import { ProfileResponseDto } from '@src/profile/dto'
import { ProfileType } from '@src/profile/types'
import { ProfileItemDto } from '@src/profile/dto/profile-item.dto'
import { ProfileService } from '@src/profile/profile.service'

@Controller('profile')
@ApiTags('Profile routes')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get Profile by id' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProfileResponseDto,
  })
  async getProfile(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo('id') currentUserId: number,
  ): Promise<ProfileResponseDto> {
    const profileInfo = await this.profileService.getProfile(currentUserId, id)

    return {
      profile: this.buildProfileResponse(profileInfo),
    }
  }

  private buildProfileResponse(profile: ProfileType): ProfileItemDto {
    return {
      itemId: profile.id,
      item: {
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
        following: profile.following,
      },
    }
  }
}
