'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Post {
  id: string
  userId: string
  pizzeriaId?: string
  orderId?: string
  content: string
  imageUrls: string[]
  rating?: number
  likeCount: number
  commentCount: number
  shareCount: number
  userLiked: boolean
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    username: string
  }
  pizzeria?: {
    id: string
    name: string
    city: string
    state: string
  }
}

export default function CultureClubPage() {
  const router = useRouter()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState('')

  const [showComments, setShowComments] = useState<Record<string, boolean>>({})
  const [comments, setComments] = useState<Record<string, any[]>>({})
  const [commentText, setCommentText] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts(offset = 0) {
    try {
      if (offset === 0) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const response = await fetch(
        `/api/pizza-bank/culture-club/posts?limit=20&offset=${offset}`
      )

      if (!response.ok) {
        throw new Error('Failed to load posts')
      }

      const data = await response.json()

      if (offset === 0) {
        setPosts(data.posts)
      } else {
        setPosts(prev => [...prev, ...data.posts])
      }

      setHasMore(data.hasMore)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  async function handleLike(postId: string) {
    try {
      const response = await fetch(
        `/api/pizza-bank/culture-club/posts/${postId}/like`,
        { method: 'POST' }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to like post')
      }

      const { liked, likeCount } = await response.json()

      // Update post in state
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, userLiked: liked, likeCount }
            : post
        )
      )
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  async function loadComments(postId: string) {
    try {
      const response = await fetch(
        `/api/pizza-bank/culture-club/posts/${postId}/comments`
      )

      if (!response.ok) {
        throw new Error('Failed to load comments')
      }

      const data = await response.json()
      setComments(prev => ({ ...prev, [postId]: data.comments }))
      setShowComments(prev => ({ ...prev, [postId]: true }))
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  async function handleAddComment(postId: string) {
    const content = commentText[postId]?.trim()
    if (!content) return

    try {
      const response = await fetch(
        `/api/pizza-bank/culture-club/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add comment')
      }

      const { comment } = await response.json()

      // Add comment to state
      setComments(prev => ({
        ...prev,
        [postId]: [comment, ...(prev[postId] || [])],
      }))

      // Update comment count
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, commentCount: post.commentCount + 1 }
            : post
        )
      )

      // Clear input
      setCommentText(prev => ({ ...prev, [postId]: '' }))
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  async function handleDeleteComment(commentId: string, postId: string) {
    if (!confirm('Delete this comment?')) return

    try {
      const response = await fetch(
        `/api/pizza-bank/culture-club/comments/${commentId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      // Remove comment from state
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].filter(c => c.id !== commentId),
      }))

      // Update comment count
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, commentCount: Math.max(0, post.commentCount - 1) }
            : post
        )
      )
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  function formatTimeAgo(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const PostCard = ({ post }: { post: Post }) => {
    const commentsShown = showComments[post.id]
    const postComments = comments[post.id] || []

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
      >
        {/* Post Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                {post.user?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="font-semibold">{post.user?.username || 'Unknown'}</div>
                <div className="text-sm text-gray-400">{formatTimeAgo(post.createdAt)}</div>
              </div>
            </div>
            {post.rating && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < post.rating! ? 'text-yellow-400' : 'text-gray-600'}>
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>

          {post.pizzeria && (
            <Link
              href={`/pizza-bank/pizzerias/${post.pizzeriaId}`}
              className="mt-2 inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              <span>🍕</span>
              <span>{post.pizzeria.name}</span>
            </Link>
          )}
        </div>

        {/* Post Content */}
        <div className="p-4">
          <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{post.content}</p>

          {/* Images */}
          {post.imageUrls && post.imageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {post.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="px-4 py-3 border-t border-gray-700 flex items-center gap-6">
          <button
            onClick={() => handleLike(post.id)}
            className={`flex items-center gap-2 transition-colors ${
              post.userLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <span className="text-xl">{post.userLiked ? '❤️' : '🤍'}</span>
            <span className="font-semibold">{post.likeCount}</span>
          </button>

          <button
            onClick={() => {
              if (!commentsShown) {
                loadComments(post.id)
              } else {
                setShowComments(prev => ({ ...prev, [post.id]: false }))
              }
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-xl">💬</span>
            <span className="font-semibold">{post.commentCount}</span>
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {commentsShown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700 bg-gray-900/50"
            >
              {/* Add Comment */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText[post.id] || ''}
                    onChange={e =>
                      setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        handleAddComment(post.id)
                      }
                    }}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={!commentText[post.id]?.trim()}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="max-h-96 overflow-y-auto">
                {postComments.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {postComments.map(comment => (
                      <div key={comment.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                {comment.user?.username || 'Unknown'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatTimeAgo(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">{comment.content}</p>
                          </div>
                          {comment.userId === comment.user?.id && (
                            <button
                              onClick={() => handleDeleteComment(comment.id, post.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors text-sm ml-2"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading feed...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">🍕 Culture Club</h1>
            <Link
              href="/pizza-bank/culture-club/new"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
            >
              + New Post
            </Link>
          </div>
          <p className="text-gray-400">
            Share your pizza experiences, reviews, and moments with the community
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😴</div>
            <h2 className="text-2xl font-bold mb-2">No Posts Yet</h2>
            <p className="text-gray-400 mb-6">
              Be the first to share your pizza experience!
            </p>
            <Link
              href="/pizza-bank/culture-club/new"
              className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
            >
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={() => fetchPosts(posts.length)}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
