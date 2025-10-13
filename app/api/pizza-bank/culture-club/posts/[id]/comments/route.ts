import { NextRequest, NextResponse } from 'next/server'
import db, { cultureClubPosts, postComments, users } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, desc, sql } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/culture-club/posts/[id]/comments - Get comments for a post
 * Query params: limit, offset
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Check if post exists
    const post = await db
      .select()
      .from(cultureClubPosts)
      .where(eq(cultureClubPosts.id, postId))
      .limit(1)

    if (post.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Fetch comments with user data
    const comments = await db
      .select({
        comment: postComments,
        user: {
          id: users.id,
          username: users.username,
        },
      })
      .from(postComments)
      .leftJoin(users, eq(postComments.userId, users.id))
      .where(eq(postComments.postId, postId))
      .orderBy(desc(postComments.createdAt))
      .limit(limit)
      .offset(offset)

    const formattedComments = comments.map(({ comment, user }) => ({
      ...comment,
      user: user
        ? {
            id: user.id,
            username: user.username,
          }
        : null,
    }))

    return NextResponse.json({
      comments: formattedComments,
      count: formattedComments.length,
      hasMore: formattedComments.length === limit,
    })
  } catch (error: any) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pizza-bank/culture-club/posts/[id]/comments - Add comment to post
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
    const body = await request.json()
    const { content } = body

    // Validate content
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be 1000 characters or less' },
        { status: 400 }
      )
    }

    // Check if post exists
    const post = await db
      .select()
      .from(cultureClubPosts)
      .where(eq(cultureClubPosts.id, postId))
      .limit(1)

    if (post.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Create comment
    const newComment = await db
      .insert(postComments)
      .values({
        postId,
        userId: user.id,
        content: content.trim(),
      })
      .returning()

    // Increment comment count on post
    await db
      .update(cultureClubPosts)
      .set({
        commentCount: sql`${cultureClubPosts.commentCount} + 1`,
      })
      .where(eq(cultureClubPosts.id, postId))

    // Fetch comment with user data
    const commentWithUser = await db
      .select({
        comment: postComments,
        user: {
          id: users.id,
          username: users.username,
        },
      })
      .from(postComments)
      .leftJoin(users, eq(postComments.userId, users.id))
      .where(eq(postComments.id, newComment[0].id))
      .limit(1)

    const result = commentWithUser[0]

    return NextResponse.json(
      {
        message: 'Comment added successfully',
        comment: {
          ...result.comment,
          user: result.user
            ? {
                id: result.user.id,
                username: result.user.username,
              }
            : null,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment', details: error.message },
      { status: 500 }
    )
  }
}
