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
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlVTRVIiLCJpYXQiOjE2MDQzMjg4NjUsImV4cCI6MTYwNDM3MjA2NX0.6p_fTH5QqW7LePIMQ_QrYSg5DTnfTAoMQnqQnxFI1L0',
  })
  public readonly token: string;
}
