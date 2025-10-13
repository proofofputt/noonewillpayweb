import { NextRequest, NextResponse } from 'next/server'
import db, { cultureClubPosts, postLikes } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and, sql } from 'drizzle-orm'

/**
 * POST /api/pizza-bank/culture-club/posts/[id]/like - Toggle like on post
 * Returns: { liked: boolean, likeCount: number }
 */
export async function POST(
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

    const postId = params.id

    // Check if post exists
    const post = await db
      .select()
      .from(cultureClubPosts)
      .where(eq(cultureClubPosts.id, postId))
      .limit(1)

    if (post.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if user already liked this post
    const existingLike = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, user.id)))
      .limit(1)

    if (existingLike.length > 0) {
      // Unlike: Remove the like
      await db
        .delete(postLikes)
        .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, user.id)))

      // Decrement like count
      await db
        .update(cultureClubPosts)
        .set({
          likeCount: sql`${cultureClubPosts.likeCount} - 1`,
        })
        .where(eq(cultureClubPosts.id, postId))

      // Get updated count
      const updatedPost = await db
        .select()
        .from(cultureClubPosts)
        .where(eq(cultureClubPosts.id, postId))
        .limit(1)

      return NextResponse.json({
        message: 'Post unliked',
        liked: false,
        likeCount: updatedPost[0].likeCount,
      })
    } else {
      // Like: Add a new like
      await db.insert(postLikes).values({
        postId,
        userId: user.id,
      })

      // Increment like count
      await db
        .update(cultureClubPosts)
        .set({
          likeCount: sql`${cultureClubPosts.likeCount} + 1`,
        })
        .where(eq(cultureClubPosts.id, postId))

      // Get updated count
      const updatedPost = await db
        .select()
        .from(cultureClubPosts)
        .where(eq(cultureClubPosts.id, postId))
        .limit(1)

      return NextResponse.json({
        message: 'Post liked',
        liked: true,
        likeCount: updatedPost[0].likeCount,
      })
    }
  } catch (error: any) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like', details: error.message },
      { status: 500 }
    )
  }
}
