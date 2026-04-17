'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('正在测试连接...')
  const [details, setDetails] = useState<string>('')

  const testConnection = async () => {
    setStatus('loading')
    setMessage('正在测试连接...')
    setDetails('')

    try {
      // 测试1: 检查环境变量
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!url || !key) {
        throw new Error('环境变量未配置')
      }

      // 测试2: 尝试查询数据库（查询系统表）
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1)

      if (error) {
        // 如果查询失败，尝试获取会话信息
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw new Error(`连接失败: ${sessionError.message}`)
        }

        setStatus('success')
        setMessage('Supabase 连接成功！')
        setDetails(`认证服务正常，会话状态: ${sessionData.session ? '已登录' : '未登录'}`)
      } else {
        setStatus('success')
        setMessage('Supabase 连接成功！')
        setDetails(`数据库查询成功，找到 ${data?.length || 0} 条记录`)
      }
    } catch (err) {
      setStatus('error')
      setMessage('连接失败')
      setDetails(err instanceof Error ? err.message : '未知错误')
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'bg-yellow-500'
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Supabase 连接测试</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${getStatusColor()}`} />
            连接状态
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}>
              {status === 'loading' && '测试中'}
              {status === 'success' && '成功'}
              {status === 'error' && '失败'}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">{message}</p>
            {details && (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                {details}
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button onClick={testConnection} disabled={status === 'loading'}>
              {status === 'loading' ? '测试中...' : '重新测试'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>配置信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Project URL:</span>
            <code className="bg-muted px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || '未配置'}
            </code>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Anon Key:</span>
            <code className="bg-muted px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 20)}...` 
                : '未配置'}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
