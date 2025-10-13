import { NextRequest, NextResponse } from 'next/server'
import db, { cultureClubPosts, users, pizzerias, postLikes } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, sql } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/culture-club/posts/[id] - Get single post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id
    const currentUser = await getCurrentUser()

    const results = await db
      .select({
        post: cultureClubPosts,
        user: {
          id: users.id,
          username: users.username,
        },
        pizzeria: pizzerias,
        userLiked: currentUser
          ? sql<boolean>`EXISTS(
              SELECT 1 FROM ${postLikes}
              WHERE ${postLikes.postId} = ${cultureClubPosts.id}
              AND ${postLikes.userId} = ${currentUser.id}
            )`
          : sql<boolean>`false`,
      })
      .from(cultureClubPosts)
      .leftJoin(users, eq(cultureClubPosts.userId, users.id))
      .leftJoin(pizzerias, eq(cultureClubPosts.pizzeriaId, pizzerias.id))
      .where(eq(cultureClubPosts.id, postId))
      .limit(1)

    if (results.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const { post, user, pizzeria, userLiked } = results[0]

    return NextResponse.json({
      post: {
        ...post,
        imageUrls: post.imageUrls ? JSON.parse(post.imageUrls) : [],
        user: user
          ? {
              id: user.id,
              username: user.username,
            }
          : null,
        pizzeria: pizzeria
          ? {
              id: pizzeria.id,
              name: pizzeria.name,
              city: pizzeria.city,
              state: pizzeria.state,
            }
          : null,
        userLiked,
      },
    })
  } catch (error: any) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/pizza-bank/culture-club/posts/[id] - Update post
 */
export async function PATCH(
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
    const { content, imageUrls, rating } = body

    // Check if post exists and user owns it
    const existingPost = await db
      .select()
      .from(cultureClubPosts)
      .where(eq(cultureClubPosts.id, postId))
      .limit(1)

    if (existingPost.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existingPost[0].userId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only edit your own posts.' },
        { status: 403 }
      )
    }

    // Validate content if provided
    if (content !== undefined) {
      if (content.trim().length === 0) {
        return NextResponse.json(
          { error: 'Content cannot be empty' },
          { status: 400 }
        )
      }
      if (content.length > 5000) {
        return NextResponse.json(
          { error: 'Content must be 5000 characters or less' },
          { status: 400 }
        )
      }
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Build update object
    const updateData: any = {}
    if (content !== undefined) updateData.content = content.trim()
    if (imageUrls !== undefined) {
      updateData.imageUrls =
        imageUrls && imageUrls.length > 0 ? JSON.stringify(imageUrls) : null
    }
    if (rating !== undefined) updateData.rating = rating

    // Update post
    const updatedPost = await db
      .update(cultureClubPosts)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(cultureClubPosts.id, postId))
      .returning()

    // Fetch complete post with details
    const postWithDetails = await db
      .select({
        post: cultureClubPosts,
        user: {
          id: users.id,
          username: users.username,
        },
        pizzeria: pizzerias,
        userLiked: sql<boolean>`EXISTS(
          SELECT 1 FROM ${postLikes}
          WHERE ${postLikes.postId} = ${cultureClubPosts.id}
          AND ${postLikes.userId} = ${user.id}
        )`,
      })
      .from(cultureClubPosts)
      .leftJoin(users, eq(cultureClubPosts.userId, users.id))
      .leftJoin(pizzerias, eq(cultureClubPosts.pizzeriaId, pizzerias.id))
      .where(eq(cultureClubPosts.id, postId))
      .limit(1)

    const result = postWithDetails[0]

    return NextResponse.json({
      message: 'Post updated successfully',
      post: {
        ...result.post,
        imageUrls: result.post.imageUrls ? JSON.parse(result.post.imageUrls) : [],
        user: result.user
          ? {
              id: result.user.id,
              username: result.user.username,
            }
          : null,
        pizzeria: result.pizzeria
          ? {
              id: result.pizzeria.id,
              name: result.pizzeria.name,
              city: result.pizzeria.city,
              state: result.pizzeria.state,
            }
          : null,
        userLiked: result.userLiked,
      },
    })
  } catch (error: any) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/pizza-bank/culture-club/posts/[id] - Delete post
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

    const postId = params.id

    // Check if post exists and user owns it
    const existingPost = await db
      .select()
      .from(cultureClubPosts)
      .where(eq(cultureClubPosts.id, postId))
      .limit(1)

    if (existingPost.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existingPost[0].userId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only delete your own posts.' },
        { status: 403 }
      )
    }

    // Soft delete by setting visible to false
    await db
      .update(cultureClubPosts)
      .set({
        visible: false,
        updatedAt: new Date(),
      })
      .where(eq(cultureClubPosts.id, postId))

    return NextResponse.json({
      message: 'Post deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post', details: error.message },
      { status: 500 }
    )
  }
}
