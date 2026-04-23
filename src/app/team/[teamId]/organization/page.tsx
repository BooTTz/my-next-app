"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, ChevronRight, Plus, FolderTree, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface TreeNode {
  id: string;
  name: string;
  type: string;
  memberCount: number;
  children?: TreeNode[];
}

  const ORG_TREE: TreeNode[] = [
  {
    id: "n1",
    name: "博兴县2025年度安全检查工作组",
    type: "department",
    memberCount: 8,
    children: [
      {
        id: "n2",
        name: "监管部门",
        type: "group",
        memberCount: 2,
        children: [
          { id: "n3", name: "监管负责人组", type: "group", memberCount: 1 },
          { id: "n4", name: "监管人员组", type: "group", memberCount: 1 },
        ],
      },
      {
        id: "n5",
        name: "服务机构",
        type: "group",
        memberCount: 3,
        children: [
          { id: "n6", name: "检查一组", type: "group", memberCount: 2 },
          { id: "n7", name: "检查二组", type: "group", memberCount: 1 },
        ],
      },
      {
        id: "n8",
        name: "企业单位",
        type: "group",
        memberCount: 3,
        children: [
          { id: "n9", name: "鑫盛金属制品", type: "group", memberCount: 2 },
          { id: "n10", name: "华宇建材", type: "group", memberCount: 1 },
        ],
      },
    ],
  },
];

function TreeItem({ node, level = 0 }: { node: TreeNode; level?: number }) {
  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50 cursor-pointer transition-colors"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {node.children ? (
          <ChevronRight className="size-3.5 text-muted-foreground" />
        ) : (
          <span className="size-3.5" />
        )}
        {node.type === "department" ? (
          <Building2 className="size-4 text-primary" />
        ) : (
          <FolderTree className="size-4 text-muted-foreground" />
        )}
        <span className="text-sm font-medium flex-1">{node.name}</span>
        <Badge variant="secondary" className="text-[10px]">
          <Users className="size-3 mr-1" /> {node.memberCount}
        </Badge>
      </div>
      {node.children?.map((child) => (
        <TreeItem key={child.id} node={child} level={level + 1} />
      ))}
    </div>
  );
}

export default function OrganizationPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link
          href="/workspace"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          返回工作台
        </Link>
      </div>

      <PageHeader title="组织架构">
        <Button size="sm" onClick={() => toast.info("新建节点功能")}>
          <Plus className="size-3.5" /> 新建节点
        </Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">组织树</CardTitle>
          </CardHeader>
          <CardContent>
            {ORG_TREE.map((node) => (
              <TreeItem key={node.id} node={node} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">节点信息</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              点击左侧节点查看详情
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
