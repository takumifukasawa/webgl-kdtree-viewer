class Node {
    splittingValue = null; // 中間nodeの時分割値を保存
    point = null; // 葉のときに値を保存
    axis = null; // 中間nodeの時に分割軸を保存
    leftChild = null; // 中間nodeの時に左の子を保存
    rightChild = null; // 中間nodeの時に左の子を保存
    constructor() {
    }
}

export default class KdTree {
    #axes;
    #root;

    constructor(pointList) {
        this.#axes = Object.getOwnPropertyNames(pointList[0]);
        const iter = KdTree.iter(pointList, this.#axes);
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
        // const baseIndex = sorted.length / 2;
        // const m1 = sorted[baseIndex - 1];
        // const m2 = sorted[baseIndex];
        // const medianValue = axes.reduce((prev, current, v) => {
        //     prev[current] = (m1[current] + m2[current]) / 2;
        //     return prev;
        // }, {});
        return [
            sorted[sorted.length / 2],
            sorted,
        ];
    }

    static iter(list, axes, depth = 0) {
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
        if(beforeList.length === 0) {
            // NOTE: 0 のときにわざわざこの処理をする必要はなさそう
            node.leftChild = null;
        } else if(beforeList.length === 1) {
            const leftNode = new Node();
            leftNode.point = beforeList[0];
            node.leftChild = leftNode;
        } else {
            node.leftChild = KdTree.iter(beforeList, axes, depth + 1);
        }
        if(afterList.length === 0) {
            // NOTE: 0 のときにわざわざこの処理をする必要はなさそう
            node.rightChild = null;
        } else if(afterList.length === 1) {
            const rightNode = new Node();
            rightNode.point = afterList[0];
            node.rightChild = rightNode;
        } else {
            node.rightChild = KdTree.iter(afterList, axes, depth + 1);
        }
        return node;
    }

    findArea(targetPoint) {
        const find = (currentNode, target) => {
        }
        find(this.#axes, target);
    }
}