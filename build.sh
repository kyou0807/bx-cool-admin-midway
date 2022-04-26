### 
 # @Description: 部署docker
 # @Autor: 池樱千幻
 # @Change: 池樱千幻
 # @Date: 2022-04-20 11:03:44
 # @LastEditTime: 2022-04-22 08:54:46
### 

# 先删 none 的镜像
docker rmi $(docker images | grep "none" | awk '{print $3}')

# 再停止 bxmidway 的容器
docker stop $(docker ps -a | grep "bxmidway" | awk '{print $1 }')

# 删除 bxmidway 的容器
docker rm $(docker ps -a | grep "bxmidway" | awk '{print $1 }')

# 删除镜像
docker rmi $(docker images | grep "bxmidway" | awk '{print $3}')

# 制作新的镜像

docker build -t bxmidway .

# 部署镜像
docker run -itd -p 8001:8001 bxmidway