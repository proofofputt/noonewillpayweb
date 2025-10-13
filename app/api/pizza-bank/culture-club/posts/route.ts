import { NextRequest, NextResponse } from 'next/server'
import db, { cultureClubPosts, users, pizzerias, postLikes } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, desc, sql, and } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/culture-club/posts - Browse posts (social feed)
 * Query params: pizzeriaId, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pizzeriaId = searchParams.get('pizzeriaId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get current user to check for liked posts
    const currentUser = await getCurrentUser()

    // Build where conditions
    const whereConditions = [eq(cultureClubPosts.visible, true)]
    if (pizzeriaId) {
      whereConditions.push(eq(cultureClubPosts.pizzeriaId, pizzeriaId))
    }

    const results = await db
      .select({
        post: cultureClubPosts,
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
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
      .where(and(...whereConditions))
      .orderBy(desc(cultureClubPosts.createdAt))
      .limit(limit)
      .offset(offset)

    const posts = results.map(({ post, user, pizzeria, userLiked }) => ({
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
    }))

    return NextResponse.json({
      posts,
      count: posts.length,
      hasMore: posts.length === limit,
    })
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pizza-bank/culture-club/posts - Create new post
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, imageUrls, pizzeriaId, orderId, rating } = body

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Content must be 5000 characters or less' },
        { status: 400 }
      )
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Validate pizzeria if provided
    if (pizzeriaId) {
      const pizzeria = await db
        .select()
        .from(pizzerias)
        .where(eq(pizzerias.id, pizzeriaId))
        .limit(1)

      if (pizzeria.length === 0) {
        return NextResponse.json(
          { error: 'Pizzeria not found' },
          { status: 404 }
        )
      }
    }

    // Create post
    const newPost = await db
      .insert(cultureClubPosts)
      .values({
        userId: user.id,
        content: content.trim(),
        imageUrls: imageUrls && imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
        pizzeriaId: pizzeriaId || null,
        orderId: orderId || null,
        rating: rating || null,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        reported: false,
        visible: true,
      })
      .returning()

    // Fetch the complete post with user and pizzeria data
    const postWithDetails = await db
      .select({
        post: cultureClubPosts,
        user: {
          id: users.id,
          username: users.username,
        },
        pizzeria: pizzerias,
      })
      .from(cultureClubPosts)
      .leftJoin(users, eq(cultureClubPosts.userId, users.id))
      .leftJoin(pizzerias, eq(cultureClubPosts.pizzeriaId, pizzerias.id))
      .where(eq(cultureClubPosts.id, newPost[0].id))
      .limit(1)

    const result = postWithDetails[0]

    return NextResponse.json(
      {
        message: 'Post created successfully',
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
          userLiked: false,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    )
  }
}
