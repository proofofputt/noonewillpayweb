import { NextRequest, NextResponse } from 'next/server'
import db, { cultureClubPosts, postComments } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, sql } from 'drizzle-orm'

/**
 * DELETE /api/pizza-bank/culture-club/comments/[id] - Delete a comment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    const commentId = params.id

    // Check if comment exists and user owns it
    const existingComment = await db
      .select()
      .from(postComments)
      .where(eq(postComments.id, commentId))
      .limit(1)

    if (existingComment.length === 0) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    const comment = existingComment[0]

    if (comment.userId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only delete your own comments.' },
        { status: 403 }
      )
    }

    // Delete comment
    await db.delete(postComments).where(eq(postComments.id, commentId))

    // Decrement comment count on post
    await db
      .update(cultureClubPosts)
      .set({
        commentCount: sql`GREATEST(0, ${cultureClubPosts.commentCount} - 1)`,
      })
      .where(eq(cultureClubPosts.id, comment.postId))

    return NextResponse.json({
      message: 'Comment deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment', details: error.message },
      { status: 500 }
    )
  }
}
