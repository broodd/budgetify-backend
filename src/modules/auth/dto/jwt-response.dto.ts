import { ApiProperty } from '@nestjs/swagger';

/**
 * [description]
 */
export class JwtResponseDto {
  /**
   * [description]
   */
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2N2YyZjNlLWI5MzYtNDAyOS05M2Q2LWIyZjU4YWU0ZjQ4OSIsImlhdCI6MTY0NDc2NzkyOH0.tCm1b-44QYc9W7vZUj2tzZnR_V_H8Zgu3jO2zLu0Kls',
  })
  public readonly token: string;
}
