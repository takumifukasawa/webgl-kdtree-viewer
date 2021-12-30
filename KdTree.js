class Node {
    splittingValue = null; // 中間nodeの時分割値を保存
    point = null; // 葉のときに値を保存
    axis = null; // 中間nodeの時に分割軸を保存
    leftChild = null; // 中間nodeの時に左の子を保存
    rightChild = null; // 中間nodeの時に左の子を保存
    parent = null; // root以外の時は親nodeを持つ
    side = null;
    constructor() {
    }
}

export default class KdTree {
    #axes;
    #root;

    constructor(pointList) {
        this.#axes = Object.getOwnPropertyNames(pointList[0]);
        const iter = KdTree.iter(pointList, this.#axes, 0);
        this.#root = iter;
    }

    static medianFunc(list, currentAxis, axes) {
        const sorted = [...list].sort((v1, v2) => {
            return v1[currentAxis] - v2[currentAxis];
        });
        const isOdd = sorted.length % 2 === 0;
        if(!isOdd) {
            const index = Math.floor(sorted.length / 2)
            return [
                sorted[index],
                sorted,
            ];
        }
        // 中間値を分割する場合
        // const baseIndex = sorted.length / 2;
        // const m1 = sorted[baseIndex - 1];
        // const m2 = sorted[baseIndex];
        // const medianValue = axes.reduce((prev, current, v) => {
        //     prev[current] = (m1[current] + m2[current]) / 2;
        //     return prev;
        // }, {});
        // 中間値を平均化しない場合
        const medianValue = sorted[sorted.length / 2 - 1];
        return [
            medianValue,
            sorted,
        ];
    }

    static iter(list, axes, depth, side = null, parent = null) {
        const axisIndex = depth % axes.length;
        const axis = axes[axisIndex];

        const [median, sortedList] = KdTree.medianFunc(list, axis, axes);

        const beforeList = sortedList.splice(
            0,
            sortedList.length % 2 == 0
                ? sortedList.length / 2
                : Math.ceil(sortedList.length / 2)
        );
        const afterList = sortedList;

        const node = new Node();
        node.splittingValue = median;
        node.axis = axis;
        node.side = side;
        node.parent = parent;

        if(beforeList.length === 0) {
            // NOTE: 0 のときにわざわざこの処理をする必要はなさそう
            node.leftChild = null;
        } else if(beforeList.length === 1) {
            const leftNode = new Node();
            leftNode.side = "left";
            leftNode.point = beforeList[0];
            leftNode.parent = node;
            node.leftChild = leftNode;
        } else {
            node.leftChild = KdTree.iter(beforeList, axes, depth + 1, "left", node);
        }
        if(afterList.length === 0) {
            // NOTE: 0 のときにわざわざこの処理をする必要はなさそう
            node.rightChild = null;
        } else if(afterList.length === 1) {
            const rightNode = new Node();
            rightNode.side = "right";
            rightNode.point = afterList[0];
            rightNode.parent = node;
            node.rightChild = rightNode;
        } else {
            node.rightChild = KdTree.iter(afterList, axes, depth + 1, "right", node);
        }
        return node;
    }

    findNearestArea(targetPoint) {
        const find = (currentNode, target) => {
            // 子node
            if(!currentNode.axis) {
                return currentNode;
            }

            if(!currentNode.leftChild) {
                return find(currentNode.rightChild)
            }
            if(!currentNode.rightChild) {
                return find(currentNode.leftChild);
            }

            const axis = currentNode.axis; 

            if(target[axis] <= currentNode.splittingValue[axis]) {
                return find(currentNode.leftChild, target);
            } else {
                return find(currentNode.rightChild, target);
            }
        }
        const node = find(this.#root, targetPoint);
        return node;
    }

    findNearestNode(targetPoint) {
        const calcDistance = (p1, p2) => {
            // TODO: 3d
            const distance = Math.sqrt(
                Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2),
            );
            return distance;
        }

        let cacheDistance = Infinity;
        // let cacheNode = null;

        // const find = (q, n) => {
        //     // last node
        //     if(!n.leftChild && !n.rightChild) {
        //         const distance = calcDistance(q, n.point);
        //         if(distance < cacheDistance) {
        //             console.log("fjeipoafjpa", distance, q, n)
        //             cacheDistance = distance;
        //             cacheNode = n;
        //         }
        //     } else {
        //         console.log(q, n.splittingValue, n.axis, cacheDistance, cacheNode)
        //         const distance = calcDistance(q, n.splittingValue);
        //         // if(distance < cacheDistance) {
        //         //     cacheDistance = distance;
        //         //     cacheNode = n;
        //         // }
        //         if(q[n.axis] < n.splittingValue[n.axis]) {
        //             if(q[n.axis] - cacheDistance < n.splittingValue[n.axis]) {
        //                 return find(q, n.leftChild);
        //             } else {
        //                 return find(q, n.rightChild);
        //             }
        //         } else {
        //             if(q[n.axis] + cacheDistance > n.splittingValue[n.axis]) {
        //                 return find(q, n.rightChild);
        //             } else {
        //                 return find(q, n.leftChild);
        //             }
        //         }
        //     }
        // }

        const nearestArea = this.findNearestArea(targetPoint);

        let nearestNode = nearestArea;
        let minDistance = calcDistance(targetPoint, nearestArea.point);

        console.log("=====================")
        console.log("nearest area", nearestArea)
        console.log("=====================")


        const find = (q, node) => {
            const check = (q, parentNode) => {
                console.log("===")
                console.log("check arg", q, parentNode)
                console.log(parentNode.axis, q[parentNode.axis], parentNode.splittingValue[parentNode.axis], minDistance)
                console.log("branch", [parentNode.axis] < parentNode.splittingValue[parentNode.axis])
                if(q[parentNode.axis] < parentNode.splittingValue[parentNode.axis]) {
                    if(q[parentNode.axis] - minDistance <= parentNode.splittingValue[parentNode.axis]) {
                        console.log(parentNode.parent)
                        if(!parentNode.parent) {
                            const distance = calcDistance(q, parentNode.splittingValue);
                            if(distance < minDistance) {
                                nearestNode = node;
                                minDistance = distance;
                            }
                            return;
                        }
                        const node = this.findNearestArea(parentNode.rightChild);
                        const distance = calcDistance(q, node.point);
                        if(distance < minDistance) {
                            nearestNode = node;
                            minDistance = distance;
                        }
                        return find(q, parentNode);
                    } else {
                        if(!parentNode.parent) {
                            return;
                        } 
                        return find(q, parentNode.parent);
                    }
                } else {
                    if(q[parentNode.axis] + minDistance > parentNode.splittingValue[parentNode.axis]) {
                        if(!parentNode.parent) {
                            return;
                        } 
                        return find(q, parentNode);
                    } else {
                        if(!parentNode.parent) {
                            const distance = calcDistance(q, parentNode.splittingValue);
                            if(distance < minDistance) {
                                nearestNode = node;
                                minDistance = distance;
                            }
                            return;
                        }
                        const node = this.findNearestArea(parentNode.leftChild);
                        const distance = calcDistance(q, node.point);
                        if(distance < minDistance) {
                            nearestNode = node;
                            minDistance = distance;
                        }
                        return find(q, parentNode);
                    }
                }
            }

            const currentNode = node;
            const parentNode = node.parent;

            // console.log("hoge", currentNode, parentNode)

            // check(q, currentNode, parentNode);

            check(q, parentNode);
            // if(parentNode) {
            // } else {
            //     check(q, currentNode, node);
            // }

            // if(q[n.axis] < n.splittingValue[n.axis]) {
            //     if(q[n.axis] - cacheDistance < n.splittingValue[n.axis]) {
            //         return find(q, n.leftChild);
            //     } else {
            //         return find(q, n.rightChild);
            //     }
            // } else {
            //     if(q[n.axis] + cacheDistance > n.splittingValue[n.axis]) {
            //         return find(q, n.rightChild);
            //     } else {
            //         return find(q, n.leftChild);
            //     }
            // }
        }

        find(targetPoint, nearestArea);

        console.log("=====================")
        console.log("result")
        console.log("nearestNode", nearestNode);
        console.log("minDistance", minDistance);
        console.log("=====================")

        return nearestArea;

        // return cacheNode;
    }
}