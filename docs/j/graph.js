// based on https://observablehq.com/@d3/multi-line-chart
class Chart {
	constructor(url, key, valueKey) {
		this.url = url
		
		// one or both of these may be set.  e.g. the key is the id of a player and the valueKey is the name of a toon
		this.key = key
		this.valueKey = valueKey
		
		this.height = 700
		this.width = 1000
		
		this.round = 1000
		
		this.id = "chart"
	}
	
	display() {
		const self = this
		jQuery.ajax({
			type: 'GET',
			async: true,
			url: this.url,
			
			success: function (data) {
				self.handleResult(data)
			}
		})
	}
	
	transformData(originalData) {
		
		const key = this.key
		const valueKey = this.valueKey
		
		// first tranform the originalData into the format we want:
		// {
		//     series = [{ name = ..., values = [ ... ]}]
		// }
		var data = {}
		data.y = originalData.y
		
		function d_to_pl(x) {
			let p = x.split("/");
			return new Date(p[2] + "-" + p[0] + "-" + p[1])
		}
		
		
		// dates are month/day/year
		data.dates = originalData.dates.map(d_to_pl)
		
		var title = this.title

		if (key && valueKey) {
			const entry = originalData.series.filter(function (e) {
				return e.id == key
			})[0]
			data.series = [{
				name: valueKey,
				id: valueKey,
				values: entry.values[valueKey],
			}]
			
			if (!title) {
				title = entry.name + " " + key
			}

		} else if (key && !valueKey) {
			const entry = originalData.series.filter(function (e) {
				return e.id == key
			})[0]
			data.series = []
			for (var vk in entry.values) {
				data.series.push({
					name: vk,
					id: vk,
					values: entry.values[vk]
				})
			}
			
			if (!title) {
				title = entry.name + " All"
			}
			
		} else if (!key && valueKey) {
			data.series = originalData.series.map(function (e) {
				return {
					name: e.name,
					id: e.id,
					values: e.values[valueKey]
				}
			})
			
			if (!title) {
				title = "All " + valueKey
			}
			
		}
		
		if (this.filter) {
			data = this.filter(data)
		}
		
		return [title, data]
	}
	
	handleResult(originalData) {
			
		const values = this.transformData(originalData)
		const title = values[0]
		const data = values[1]
		
		let traces = []
		
		data["series"].forEach(function (entry) {
			let row = entry["values"].map(function(x) { return x == -1 ? null : x })
			let dates = data["dates"]
			let trace = {
				y: row,
				x: dates,
				customdata: row.map(function(item, i, array) {
					if (i > 10) {
						let days = (dates[i] - dates[i - 10]) / (24 * 3600 * 1000)
						return (array[i] - array[i - 10]) / days
					} else {
						return null
					}
				}),
				mode: "lines",
				name: entry["name"],
				hovertemplate: '%{x}: %{y}, %{customdata:.2s} / day',
			}
			traces.push(trace)
		});
		
		let layout = {
			title: title,
			width: this.width,
			height: this.height,
			yaxis:{hoverformat: '.3s'},
			xaxis:{hoverformat: '%x'},
			hovermode: "closest",
		}
		
		Plotly.newPlot(this.id, traces, layout);
	}
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
