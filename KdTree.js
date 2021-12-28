class Node {
    value = null;
    leftChild = null;
    rightChild = null;
    constructor(value) {
        this.value = value;
    }
}

export default class KdTree {
    #root;

    constructor(pointList, dimension) {
        const axes = ["x", "y", "z"].splice(0, dimension);
        const iter = KdTree.iter(pointList, axes, 0);
        this.#root = iter;
    }

    static medianFunc(list, axes, currentAxis) {
        const sorted = [...list].sort((v1, v2) => {
            return v1[currentAxis] - v2[currentAxis];
        });
        const isOdd = sorted.length % 2 === 0;
        if(!isOdd) {
            const index = Math.floor(sorted.length / 2)
            return [
                sorted[index],
                sorted,
                index
            ];
        }
        const baseIndex = sorted.length / 2;
        const m1 = sorted[baseIndex - 1];
        const m2 = sorted[baseIndex];
        const medianValue = axes.reduce((prev, current, v) => {
            prev[current] = (m1[current] + m2[current]) / 2;
            return prev;
        }, {});
        return [
            medianValue,
            sorted,
            baseIndex - 0.5
        ];
    }

    static iter(list, axes, depth) {
        if(list.length < 1) {
            return null;
        }
        const axisIndex = depth % axes.length;
        const axis = axes[axisIndex];
        const [median, sortedList] = KdTree.medianFunc(list, axes, axis);
        const beforeList = sortedList.splice(
            0,
            sortedList.length % 2 == 0
                ? sortedList.length / 2
                : Math.floor(sortedList.length / 2)
        );
        const afterList = sortedList;
        const node = new Node(median);
        if(beforeList.length === 1) {
            node.leftChild = new Node(beforeList[0]);
        } else {
            node.leftChild = KdTree.iter(beforeList, axes, depth + 1);
        }
        if(afterList.length === 1) {
            node.rightChild = new Node(afterList[0]);
        } else {
            node.rightChild = KdTree.iter(afterList, axes, depth + 1);
        }
        return node;
    }
}